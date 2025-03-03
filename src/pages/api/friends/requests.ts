import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/client";
import { friends, users } from "@/db/schema/schema";
import { eq, and } from "drizzle-orm";
import jwt from "jsonwebtoken";

function getUserId(req: NextApiRequest) {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as { id: string };
    return decoded.id;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const receiverId = getUserId(req);

    const requests = await db
        .select({
            friendId: friends.id,
            requesterId: friends.requesterId,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            avatar: users.avatar
        })
        .from(friends)
        .innerJoin(users, eq(friends.requesterId, users.id))
        .where(and(eq(friends.receiverId, receiverId), eq(friends.status, "pending")))
        .execute();

    return res.status(200).json(requests);
}
