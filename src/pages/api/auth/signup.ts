import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import {db} from "@/db/client";
import {users} from "@/db/schema/schema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

    try {

        const existingUser = await db
            .select()
            .from(users)
            .where(users.email.equals(email))
            .execute();

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.insert(users).values({ email, password: hashedPassword }).execute();

        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
