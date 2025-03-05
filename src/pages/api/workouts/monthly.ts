import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/client";
import { workouts } from "@/db/schema/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { endOfMonth, format } from "date-fns";
import {getUserIdFromToken} from "@/lib/auth/auth-utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { month } = req.query;
    if (!month || typeof month !== "string") {
        return res.status(400).json({ error: "Month parameter is required (format: yyyy-MM)" });
    }

    const startDate = `${month}-01`;
    const endDate = format(endOfMonth(new Date(startDate)), "yyyy-MM-dd");

    const results = await db
        .select({
            date: workouts.date,
            workoutCount: sql<number>`count(*)`.mapWith(Number),  // belangrijk, juiste alias!
        })
        .from(workouts)
        .where(
            and(
                eq(workouts.userId, userId),
                gte(workouts.date, startDate),
                lte(workouts.date, endDate)
            )
        )
        .groupBy(workouts.date)
        .execute();

    res.json(Array.isArray(results) ? results : []);

}
