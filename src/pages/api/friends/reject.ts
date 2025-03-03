import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/client";
import { friends } from "@/db/schema/schema";
import jwt from "jsonwebtoken";
import { eq, and } from "drizzle-orm";

function getUserId(req: NextApiRequest) {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as { id: string };
    return decoded.id;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const receiverId = getUserId(req);
    const { requesterId } = req.body;

    if (!requesterId) return res.status(400).json({ error: "Requester ID required" });

    await db.delete(friends)
        .where(and(eq(friends.requesterId, requesterId), eq(friends.receiverId, receiverId)))
        .execute();

    res.status(200).json({ message: "Friend request rejected!" });
}
