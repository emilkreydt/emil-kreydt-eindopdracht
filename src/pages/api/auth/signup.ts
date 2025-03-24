import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { db } from "@/db/client";
import { users } from "@/db/schema/schema";
import { eq } from "drizzle-orm";

interface SignupRequestBody {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    age: number;
    weight: number;
    height: number;
    gender: string;
    avatar: string;
}

type SignupResponse =
    | { message: string }
    | { error: string };

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

        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .execute();

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
            avatar,
        }).execute();

        return res.status(201).json({ message: "Welcome to TapFit!" });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
