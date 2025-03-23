import { useState } from "react";
import { supabase } from "../../supabase"; // Adjust if needed
import { useRouter } from "next/router"; // Use Next.js router

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // To handle loading state
  const [isSignUpPage, setIsSignUpPage] = useState(false); // Toggle between SignUp and SignIn
  const router = useRouter(); // Get the router instance

  const signUp = async () => {
    setLoading(true);
    try {
      // Check if the email exists in the Users table
      const { data, error } = await supabase
        .from("User")
        .select("id")
        .eq("email", email)
        .single();

      if (data) {
        // If email exists, prompt user to log in
        alert("Email already exists. Please log in.");
      } else {
        // If email doesn't exist, proceed with sign up
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          alert(signUpError.message);
        } else {
          alert("Check your email for confirmation!");
          setIsSignUpPage(false); // Switch to login after successful sign-up
        }
      }
    } catch (error) {
      console.error("Error checking email:", error);
      alert("An error occurred, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    setLoading(true);
    try {
      // Check if the email exists in the Users table
      const { data, error } = await supabase
        .from("User")
        .select("id")
        .eq("email", email)
        .single();

      if (!data) {
        // If email doesn't exist, prompt user to sign up
        alert("Email not found. Please sign up.");
      } else {
        // If email exists, sign the user in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          alert(signInError.message);
        } else {
          router.push("/dashboard"); // Redirect after login using Next.js router
        }
      }
    } catch (error) {
      console.error("Error checking email:", error);
      alert("An error occurred, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
        backgroundColor: "#121212", // Dark background color for the entire page
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden", // Prevents scrolling
      }}
    >
      <div
        style={{
          backgroundColor: "#2c2c2c", // Dark container to match the dashboard's theme
          padding: "30px 40px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          width: "320px", // Adjust the width as needed
          textAlign: "center",
          color: "#fff", // White text for contrast
        }}
      >
        <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
          {isSignUpPage ? "Sign Up" : "Sign In"}
        </h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "1px solid #444",
            boxSizing: "border-box",
            backgroundColor: "#333",
            color: "#fff",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #444",
            boxSizing: "border-box",
            backgroundColor: "#333",
            color: "#fff",
          }}
        />
        <button
          onClick={isSignUpPage ? signUp : signIn}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#4CAF50", // Green button for primary action
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "10px",
            fontSize: "16px",
          }}
          disabled={loading}
        >
          {loading ? (isSignUpPage ? "Signing Up..." : "Logging In...") : isSignUpPage ? "Sign Up" : "Sign In"}
        </button>

        <div style={{ marginTop: "10px" }}>
          {isSignUpPage ? (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => setIsSignUpPage(false)}
                style={{ color: "#007BFF", cursor: "pointer" }}
              >
                Log in here
              </span>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <span
                onClick={() => setIsSignUpPage(true)}
                style={{ color: "#007BFF", cursor: "pointer" }}
              >
                Sign up here
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
