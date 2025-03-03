import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/client";
import { users, friends } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

function getUserId(req: NextApiRequest) {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as { id: string };
    return decoded.id;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const requesterId = getUserId(req);
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required." });

    const [receiver] = await db.select().from(users).where(eq(users.email, email)).execute();

    if (!receiver) {
        return res.status(404).json({ error: "User not found." });
    }

    const receiverId = receiver.id;

    const existingRequest = await db
        .select()
        .from(friends)
        .where(eq(friends.requesterId, requesterId) && eq(friends.receiverId, receiverId))
        .execute();

    if (existingRequest.length > 0) {
        return res.status(400).json({ error: "Friend request already sent or you are already friends." });
    }

    await db.insert(friends).values({
        requesterId,
        receiverId,
        status: "pending",
    }).execute();

    res.status(201).json({ message: "Friend request sent!" });
}
