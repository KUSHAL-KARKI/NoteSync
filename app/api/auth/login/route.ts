import user from "../../../../models/User";
import connectDB from "../../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

connectDB();

export  async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { username,password } = await req.json();
    const existingUser = await user.findOne({ username });
    if (!existingUser) {
      return NextResponse.json(
        { message: "Invalid credentials", success: false },
        { status: 401 }
      );
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
        return NextResponse.json(
          { message: "Invalid credentials", success: false },
          { status: 401 }
        );
    }
    const token = jwt.sign(
        {userId: existingUser._id, username: existingUser.username},
        process.env.JWT_SECRET_KEY!,
        {expiresIn: '7d'}
    ) 
    return NextResponse.json(
      { message: "Login successful", success: true, token },
      { status: 200 }
    );

  } catch (error) {
    console.log(error);
  }
}
