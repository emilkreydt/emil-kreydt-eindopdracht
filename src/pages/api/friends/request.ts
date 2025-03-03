import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/client";
import { friends } from "@/db/schema/schema";
import jwt from "jsonwebtoken";

function getUserId(req: NextApiRequest) {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    return decoded.id;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const requesterId = getUserId(req);
    const { receiverId } = req.body;

    if (!receiverId) return res.status(400).json({ error: "Receiver ID required" });

    await db.insert(friends).values({
        requesterId,
        receiverId,
        status: "pending"
    }).execute();

    res.status(201).json({ message: "Friend request sent!" });
}
