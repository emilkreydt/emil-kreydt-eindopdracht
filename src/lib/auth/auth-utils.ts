import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";

export function getUserIdFromToken(req: NextApiRequest): string | null {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return null;

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        return decoded.id;
    } catch (error) {
        console.error("JWT Verification Failed:", error);
        return null;
    }
}
