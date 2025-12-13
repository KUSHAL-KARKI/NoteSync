import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface DecodedToken {
  userId?: string;
  id: string;
  username: string;
  email: string;
}

export const getUserFromToken = (req: NextRequest): string | null => {
  try {
    const token = req.cookies.get("token")?.value;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as DecodedToken;
    
    return decoded.userId || decoded.id;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};