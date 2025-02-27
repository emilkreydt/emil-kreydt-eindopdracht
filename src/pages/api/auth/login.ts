import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/client";
import { users } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" });
    }

    try {
        // 🔥 FIXED: Use `eq(users.email, email)` instead of `.equals(email)`
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .execute();

        if (existingUser.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, existingUser[0].password);
        if (!validPassword) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: existingUser[0].id, email: existingUser[0].email },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
