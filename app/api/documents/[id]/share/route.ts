import connectDB from "@/lib/dbConnect";
import Document from "@/models/document";
import User from "@/models/User";
import Share from "@/models/share";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: documentId } = await params;
    const { email, permission } = await req.json();
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY!) as {
      userId: string;
    };
    const owner = decodedToken.userId;
    const document = await Document.findOne({ _id: documentId, UserId: owner });
    if (!document) {
      return new NextResponse("You are not authorized to share this document", {
        status: 404,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const existingShare = await Share.findOne({ documentId, userId: user._id });
    if (existingShare) {
      return new NextResponse("Document already shared with this user", {
        status: 400,
      });
    }
    const share = new Share({
      documentId,
      userId: user._id,
      permission: permission || "read",
    });
    await share.save();
    return NextResponse.json(
      { message: "Document shared successfully", share },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in share route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
