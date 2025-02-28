import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { db } from "@/db/client";
import { users } from "@/db/schema/schema";
import { eq } from "drizzle-orm";

// TypeScript types voor je request body
interface SignupRequestBody {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    age: number;
    weight: number;
    height: number;
    gender: string;
    avatar: string;  // dit is de Cloudinary URL die uit de frontend komt
}

// TypeScript types voor de response
type SignupResponse =
    | { message: string }
    | { error: string };

// De echte handler functie
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SignupResponse>
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const {
            email,
            password,
            firstName,
            lastName,
            age,
            weight,
            height,
            gender,
            avatar,
        } = req.body as SignupRequestBody;

        // Basic validatie - je kan dit uitbreiden
        if (
            !email ||
            !password ||
            !firstName ||
            !lastName ||
            !age ||
            !weight ||
            !height ||
            !gender ||
            !avatar
        ) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check of user al bestaat
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .execute();

        if (existingUser.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Wachtwoord hashen
        const hashedPassword = await bcrypt.hash(password, 10);

        // User opslaan in de database
        await db.insert(users).values({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            age: Number(age),
            weight: Number(weight),
            height: Number(height),
            gender,
            avatar,  // dit is de Cloudinary URL die de frontend al heeft geüpload
        }).execute();

        return res.status(201).json({ message: "Welcome to TapFit!" });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
