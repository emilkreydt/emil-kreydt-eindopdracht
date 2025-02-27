import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/client";
import { workouts } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

/**
 * Extract userId from JWT token
 */
function getUserIdFromToken(req: NextApiRequest): string | null {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Extract token
        if (!token) {
            console.error("No token provided in request");
            return null;
        }

        console.log("Verifying token:", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        console.log("Decoded user ID:", decoded.id);
        return decoded.id;
    } catch (error) {
        console.error("JWT Verification Failed:", error);
        return null;
    }
}


/**
 * API Handler
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized: No valid token" });

    try {
        if (req.method === "GET") {
            try {
                const userWorkouts = await db
                    .select()
                    .from(workouts)
                    .where(eq(workouts.userId, userId))
                    .execute();

                return res.status(200).json(userWorkouts ?? []); // Ensure response is an array
            } catch (error) {
                console.error("Workout API Error:", error);
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }


        if (req.method === "POST") {
            const { date, completed } = req.body;
            if (!date) return res.status(400).json({ error: "Missing date field" });

            // ✅ Add new workout entry
            await db.insert(workouts).values({ userId, date, completed: completed ?? true }).execute();
            return res.status(201).json({ message: "Workout added successfully" });
        }

        if (req.method === "DELETE") {
            const { date } = req.body;
            if (!date) return res.status(400).json({ error: "Missing date field" });

            // ✅ Delete workout entry for that user & date
            await db
                .delete(workouts)
                .where(eq(workouts.userId, userId) && eq(workouts.date, date))
                .execute();

            return res.status(200).json({ message: "Workout removed successfully" });
        }

        return res.status(405).json({ error: "Method Not Allowed" });
    } catch (error) {
        console.error("Workout API Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
