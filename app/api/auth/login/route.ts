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
        { message: "Username doesn't exist!", success: false },
        { status: 401 }
      );
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
        return NextResponse.json(
          { message: "Password didn't match!", success: false },
          { status: 401 }
        );
    }
    const tokenData = {
            id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email
        }

        const generateToken = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY!, {expiresIn: "1d"});
        const response = NextResponse.json({message: "Login successful", success: true}, {status: 200}) ;
        response.cookies.set("token",generateToken,{ httpOnly: true, maxAge: 24 * 60 * 60 });
        return response;

  } catch (error) {
    console.log(error);
  }
}
