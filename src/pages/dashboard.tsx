import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../supabase";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push("/auth");
        return;
      }
      setUser(data.user);
      fetchGroups(data.user.id);

      const groupSub = supabase
        .channel("groups-channel")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "Groups" },
          (payload) => setGroups((prev) => [...prev, payload.new])
        )
        .subscribe();

      return () => supabase.removeChannel(groupSub);
    };

    checkUser();
  }, []);

  const fetchGroups = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("Groups")
        .select("*")
        .eq("created_by", userId);

      if (error) throw error;
      setGroups(data);
    } catch (error) {
      console.error("Failed to fetch groups:", error.message);
    }
  };

  const fetchExpenses = async (groupId) => {
    try {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("group_id", groupId);

      if (error) throw error;
      setExpenses(data);

      const expenseSub = supabase
        .channel("expenses-channel")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "expenses" },
          (payload) => {
            if (payload.new.group_id === groupId) {
              setExpenses((prev) => [...prev, payload.new]);
            }
          }
        )
        .subscribe();

      return () => supabase.removeChannel(expenseSub);
    } catch (error) {
      console.error("Failed to fetch expenses:", error.message);
    }
  };

  const createGroup = async () => {
    if (!groupName || !user?.id) {
      alert("Enter a group name!");
      return;
    }

    try {
      await supabase.from("Groups").insert([{ name: groupName, created_by: user.id }]);
      setGroupName("");
    } catch (error) {
      console.error("Error creating group:", error.message);
    }
  };

  const createExpense = async () => {
    if (!expenseAmount || !expenseDesc || !selectedGroup || !user?.id) {
      alert("All fields are required!");
      return;
    }

    try {
      await supabase.from("expenses").insert([{
        description: expenseDesc,
        amount: parseFloat(expenseAmount),
        group_id: selectedGroup,
        user_id: user.id,
      }]);
      setExpenseAmount("");
      setExpenseDesc("");
    } catch (error) {
      console.error("Error creating expense:", error.message);
    }
  };

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  return (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        color: "#f5f5f5",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        position: "relative",
      }}
    >
      <h2 style={{ color: "#00BFFF", marginBottom: "20px" }}>Welcome, {user?.email}</h2>

      {/* Sign Out Button */}
      <button
        onClick={signOut}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "8px 15px",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background 0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#d32f2f")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#f44336")}
      >
        Sign Out
      </button>

      {/* Group Creation */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Create a New Group</h3>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group Name"
          style={{
            padding: "8px",
            marginRight: "10px",
            backgroundColor: "#333",
            color: "#f5f5f5",
            borderRadius: "8px",
            border: "1px solid #555",
          }}
        />
        <button
          onClick={createGroup}
          style={{
            padding: "8px 15px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#3e8e41")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4caf50")}
        >
          Create Group
        </button>
      </div>

      {/* Group List */}
      <h3>Your Groups</h3>
      <ul>
        {groups.map((group) => (
          <li key={group.id} style={{ marginBottom: "10px" }}>
            <button
              onClick={() => {
                setSelectedGroup(group.id);
                fetchExpenses(group.id);
              }}
              style={{
                padding: "10px",
                backgroundColor: selectedGroup === group.id ? "#007bff" : "#333",
                color: "#f5f5f5",
                borderRadius: "10px",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
                transition: "background 0.3s",
                marginBottom: "5px",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseOut={(e) => (e.target.style.backgroundColor = selectedGroup === group.id ? "#007bff" : "#333")}
            >
              {group.name}
            </button>
          </li>
        ))}
      </ul>

      {/* Expense Form & Table */}
      {selectedGroup && (
        <>
          <h3>Add Expense</h3>
          <input
            type="number"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
            placeholder="Amount"
            style={{ padding: "8px", marginRight: "10px", backgroundColor: "#333", color: "#f5f5f5", borderRadius: "8px" }}
          />
          <input
            type="text"
            value={expenseDesc}
            onChange={(e) => setExpenseDesc(e.target.value)}
            placeholder="Description"
            style={{ padding: "8px", marginRight: "10px", backgroundColor: "#333", color: "#f5f5f5", borderRadius: "8px" }}
          />
          <button onClick={createExpense} style={{ padding: "8px", backgroundColor: "#007bff", color: "white", borderRadius: "8px" }}>
            Add Expense
          </button>

          {/* Expense Table */}
          <h3>Expenses for Selected Group</h3>
          <table style={{ width: "100%", marginTop: "20px", borderCollapse: "separate", borderSpacing: "0", borderRadius: "10px", overflow: "hidden" }}>
            <thead>
              <tr style={{ backgroundColor: "#444", color: "#f5f5f5" }}>
                <th style={{ padding: "10px", border: "1px solid #555" }}>Description</th>
                <th style={{ padding: "10px", border: "1px solid #555" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id} style={{ backgroundColor: "#333" }}>
                  <td style={{ padding: "10px", border: "1px solid #555" }}>{exp.description}</td>
                  <td style={{ padding: "10px", border: "1px solid #555" }}>${exp.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
