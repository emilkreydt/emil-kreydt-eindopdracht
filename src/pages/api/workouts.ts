import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/client";
import { workouts } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

function getUserIdFromToken(req: NextApiRequest): string | null {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return null;

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        return decoded.id;
    } catch (error) {
        console.error("JWT Verification Failed:", error);
        return null;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized: No valid token" });

    try {
        if (req.method === "GET") {
            const userWorkouts = await db
                .select()
                .from(workouts)
                .where(eq(workouts.userId, userId))
                .execute();

            return res.status(200).json(userWorkouts ?? []);
        }

        if (req.method === "POST") {
            const { date, name, completed } = req.body;
            if (!date || !name) return res.status(400).json({ error: "Missing required fields" });

            await db.insert(workouts).values({ userId, date, name, completed: completed ?? true }).execute();
            return res.status(201).json({ message: "Workout added successfully" });
        }

        if (req.method === "DELETE") {
            const { date } = req.body;
            if (!date) return res.status(400).json({ error: "Missing date field" });

            await db.delete(workouts).where(eq(workouts.userId, userId) && eq(workouts.date, date)).execute();
            return res.status(200).json({ message: "Workout removed successfully" });
        }

        return res.status(405).json({ error: "Method Not Allowed" });
    } catch (error) {
        console.error("Workout API Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
