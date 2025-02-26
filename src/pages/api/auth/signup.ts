import bcrypt from "bcryptjs";
import { db } from "@/db/client";
import { users } from "@/db/schema/schema";
import { eq } from "drizzle-orm";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

    const { email, password, firstName, lastName, age, weight, height, gender } = req.body;

    if (!email || !password || !firstName || !lastName || !age || !weight || !height || !gender) {
        return res.status(400).json({ error: "Alle velden zijn verplicht" });
    }

    try {
        const existingUser = await db.select().from(users).where(eq(users.email, email)).execute();
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Gebruiker bestaat al" });
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
        }).execute();

        return res.status(201).json({ message: "Welcome to TapFit!" });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ error: "There has been an internal server error..." });
    }
}
