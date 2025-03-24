import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/client";
import { friends, users } from "@/db/schema/schema";
import jwt from "jsonwebtoken";
import { or, and, eq } from "drizzle-orm";

function getUserId(req: NextApiRequest): string | null {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return null;

        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        if (typeof decoded === "object" && decoded && "id" in decoded) {
            return (decoded as { id: string }).id;
        }

        return null;
    } catch (error) {
        console.error("JWT error:", error);
        return null;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const myUserId = getUserId(req);
    if (!myUserId) return res.status(401).json({ error: "Unauthorized" });

    const results = await db.select({
        friendId: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        avatar: users.avatar
    })
        .from(friends)
        .innerJoin(users, or(
            and(eq(friends.requesterId, myUserId), eq(friends.receiverId, users.id)),
            and(eq(friends.receiverId, myUserId), eq(friends.requesterId, users.id))
        ))
        .where(eq(friends.status, "accepted"))
        .execute();

    res.status(200).json(results);
}
