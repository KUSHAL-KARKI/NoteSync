import user from "@/models/User";
import connectDB from "@/lib/dbConnect";
import { NextRequest } from "next/server";
import { getUserFromToken } from "@/lib/auth";

connectDB();

export async function GET(req: NextRequest) {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const userData = await user.findById(userId).select("-password");
    return new Response(JSON.stringify(userData), { status: 200 });
  } catch (error) {
    throw new Response("Failed to fetch user data", { status: 500 });
  }
}
