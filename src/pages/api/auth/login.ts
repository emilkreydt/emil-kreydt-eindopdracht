import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "@/db/client";
import { users } from "@/db/schema/schema";
import { eq } from "drizzle-orm";

const DEFAULT_AVATAR = "https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar.png";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" });
    }

    const result = await db.select().from(users).where(eq(users.email, email)).execute();
    const user = result[0];

    if (!user) {
        return res.status(400).json({ error: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ error: "Incorrect password" });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
    );

    return res.status(200).json({
        message: "Login successful",
        token,
        user: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            weight: user.weight,
            height: user.height,
            gender: user.gender,
            avatar: user.avatar?.trim() ? user.avatar : DEFAULT_AVATAR,
        },
    });
}
