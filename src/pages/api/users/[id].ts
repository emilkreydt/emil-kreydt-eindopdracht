import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/client";
import { users } from "@/db/schema/schema";
import { eq } from "drizzle-orm";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.id, id as string))
            .execute();

        if (result.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = result[0];

        return res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar,
            age: user.age,
            weight: user.weight,
            height: user.height,
            gender: user.gender,
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
