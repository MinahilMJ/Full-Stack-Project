import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../../supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { groupId } = req.query;

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("group_id", groupId);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { description, amount, userId } = req.body;

    const { data, error } = await supabase
      .from("expenses")
      .insert([{ description, amount, group_id: groupId, user_id: userId }]);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  res.status(405).json({ error: "Method not allowed" });
}
