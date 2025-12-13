import Document from "@/models/document";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import { getUserFromToken } from "@/lib/auth";

connectDB();
export async function GET(req: NextRequest) {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const documents = await Document.find({
      $or: [
        {
          owner: userId,
        },
        {
          collaborators: userId,
        },
      ],
    })
      .populate("owner", "username email")
      .populate("collaborators", "username email");
    return NextResponse.json(
      { message: "Documents fetched successfully", documents },
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch documents" }),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserFromToken(req);
    console.log("Authenticated User ID:", userId);
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const { title, content, collaborators = [] } = await req.json();
    const newDocument = new Document({
      title,
      content,
      owner: userId,
      collaborators,
    });
    const savedDocument = await newDocument.save();
    return NextResponse.json(
      { message: "Document created successfully", document: savedDocument },
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to create document" }),
      { status: 500 }
    );
  }
}
