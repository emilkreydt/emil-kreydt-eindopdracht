import {db} from "@/db/client";
import {users} from "@/db/schema/schema";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    // Update de gebruiker naar admin
    await db.update(users).set({ isAdmin: true }).where(users.email.equals(email));

    return res.status(200).json({ message: "User is now an admin" });
}
