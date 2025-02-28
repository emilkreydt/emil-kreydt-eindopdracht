import bcrypt from "bcryptjs";
import { db } from "@/db/client";
import { users } from "@/db/schema/schema";
import { eq } from "drizzle-orm";

const DEFAULT_AVATAR = "https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar.png";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

    const { email, password, firstName, lastName, age, weight, height, gender, avatar } = req.body;

    if (!email || !password || !firstName || !lastName || !age || !weight || !height || !gender) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const existingUser = await db.select().from(users).where(eq(users.email, email)).execute();
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.insert(users).values({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            age: Number(age),
            weight: Number(weight),
            height: Number(height),
            gender,
            avatar: avatar?.trim() ? avatar : DEFAULT_AVATAR,
        }).execute();

        return res.status(201).json({ message: "Welcome to TapFit!" });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
