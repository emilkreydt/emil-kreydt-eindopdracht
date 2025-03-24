import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/client";
import { friends } from "@/db/schema/schema";
import jwt from "jsonwebtoken";

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
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const requesterId = getUserId(req);
    const { receiverId } = req.body;

    if (!requesterId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (!receiverId) {
        return res.status(400).json({ error: "Receiver ID required" });
    }

    await db.insert(friends).values({
        requesterId: requesterId as string,
        receiverId,
        status: "pending"
    }).execute();

    return res.status(201).json({ message: "Friend request sent!" });
}
