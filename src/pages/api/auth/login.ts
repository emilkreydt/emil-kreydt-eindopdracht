
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import {db} from "@/db/client";
import {users} from "@/db/schema/schema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

    try {
        // 🚀 Query uitvoeren en .rows gebruiken om data op te halen
        const existingUser = await db
            .select()
            .from(users)
            .where(users.email.equals(email))
            .execute();

        if (existingUser.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = existingUser.rows[0]; // ✅ Pak de eerste (en enige) gebruiker

        // ✅ Wachtwoord controleren met bcryptjs
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // ✅ JWT-token genereren
        const token = jwt.sign(
            { id: user.id, isAdmin: user.isAdmin }, // 🔥 Bevat ook de admin status
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
