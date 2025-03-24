import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/client";
import { friends, users } from "@/db/schema/schema";
import { eq, and } from "drizzle-orm";
import jwt from "jsonwebtoken";

// ✅ Haal de ingelogde user ID uit JWT
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
        console.error("JWT verification error:", error);
        return null;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const receiverId = getUserId(req);
    if (!receiverId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const requests = await db
            .select({
                requesterId: friends.requesterId,
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
                avatar: users.avatar,
            })
            .from(friends)
            .innerJoin(users, eq(friends.requesterId, users.id))
            .where(
                and(
                    eq(friends.receiverId, receiverId),
                    eq(friends.status, "pending")
                )
            )
            .execute();

        return res.status(200).json(requests);
    } catch (error) {
        console.error("Failed to fetch friend requests:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
