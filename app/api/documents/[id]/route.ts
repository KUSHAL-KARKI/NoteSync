import Document from "@/models/document";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";

connectDB();

export async function GET(
  req: NextRequest,
  { params}: { params: Promise<{ id: string }> }
) {
  const {id} = await params;
  console.log("Fetching document with ID:", id);
  if (!id) {
    return new NextResponse("Missing document ID", { status: 400 });
  }
  try {
    const document = await Document.findById(id);
    if (!document) {
      return new NextResponse("Document not found", { status: 404 });
    }
    return NextResponse.json(document);
  } catch (error) {
    throw new NextResponse("Failed to fetch document", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const {id} =await params;
  if (!id) {
    return new NextResponse("Missing document ID", { status: 400 });
  }
  try {
    const deletedDocument = await Document.findByIdAndDelete(id);
    if (!deletedDocument) {
      return new NextResponse("Document not found", { status: 404 });
    }
    return new NextResponse("Document deleted successfully", { status: 200 });
  } catch (error) {
    throw new NextResponse("Failed to delete document", { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const {id} = await params;
  if (!id) {
    return new NextResponse("Missing document ID", { status: 400 });
  }
  try {
    const body = await req.json();
    const updatedDocument = await Document.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updatedDocument) {
      return new NextResponse("Document not found", { status: 404 });
    }
    return NextResponse.json(updatedDocument);
  } catch (error) {
    throw new NextResponse("Failed to update document", { status: 500 });
  }
}
