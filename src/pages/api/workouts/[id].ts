import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/client";
import { workouts } from "@/db/schema/schema";
import { eq } from "drizzle-orm";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const result = await db
            .select()
            .from(workouts)
            .where(eq(workouts.userId, id as string))
            .execute();

        return res.status(200).json(result ?? []);
    } catch (error) {
        console.error("Error fetching workouts:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
