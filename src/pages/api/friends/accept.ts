import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/client";
import { friends } from "@/db/schema/schema";
import jwt from "jsonwebtoken";
import { eq, and } from "drizzle-orm";

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
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const receiverId = getUserId(req);
    if (!receiverId) return res.status(401).json({ error: "Unauthorized" });

    const { requesterId } = req.body;

    if (!requesterId) return res.status(400).json({ error: "Requester ID required" });

    await db.update(friends)
        .set({ status: "accepted" })
        .where(and(eq(friends.requesterId, requesterId), eq(friends.receiverId, receiverId)))
        .execute();

    res.status(200).json({ message: "Friend request accepted!" });
}
