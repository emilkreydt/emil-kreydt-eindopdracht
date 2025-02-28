import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "@/db/client";
import { users } from "@/db/schema/schema";
import { eq } from "drizzle-orm";

const DEFAULT_AVATAR = "https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar.png";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" });
    }

    const user = await db.select().from(users).where(eq(users.email, email)).execute();

    if (user.length === 0) {
        return res.status(400).json({ error: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
        return res.status(400).json({ error: "Incorrect password" });
    }

    const token = jwt.sign({ id: user[0].id, email: user[0].email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({
        message: "Login successful",
        token,
        user: {
            email: user[0].email,
            firstName: user[0].firstName,
            lastName: user[0].lastName,
            avatar: user[0].avatar?.trim() ? user[0].avatar : DEFAULT_AVATAR,
        },
    });
}
