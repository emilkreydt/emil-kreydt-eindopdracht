import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/client";
import { friends, users } from "@/db/schema/schema";
import { eq, and } from "drizzle-orm";
import jwt from "jsonwebtoken";

function getUserIdOrThrow(req: NextApiRequest): string {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("No token provided");

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded === "object" && decoded && "id" in decoded) {
        return (decoded as { id: string }).id;
    }

    throw new Error("Invalid token");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    let requesterId: string;
    try {
        requesterId = getUserIdOrThrow(req);
    } catch {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }

    const [receiver] = await db.select().from(users).where(eq(users.email, email)).execute();

    if (!receiver) {
        return res.status(404).json({ error: "User not found." });
    }

    const receiverId = receiver.id;

    const existingRequest = await db
        .select()
        .from(friends)
        .where(
            and(
                eq(friends.requesterId, requesterId),
                eq(friends.receiverId, receiverId)
            )
        )
        .execute();

    if (existingRequest.length > 0) {
        return res.status(400).json({ error: "Friend request already sent or you are already friends." });
    }

    await db.insert(friends).values({
        requesterId,
        receiverId,
        status: "pending",
    }).execute();

    return res.status(201).json({ message: "Friend request sent!" });
}
