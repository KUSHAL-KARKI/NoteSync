import Document from "@/models/document";
import Share from "@/models/share";
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

    // Get documents owned by or collaborated with the user
    const ownedDocuments = await Document.find({
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

    // Get documents shared with the user via Share collection
    const sharedDocs = await Share.find({ userId }).populate({
      path: "documentId",
      populate: {
        path: "owner",
        select: "username email",
      },
    });

    // Extract the documents from shared collection and add permission info
    const sharedDocuments = sharedDocs
      .filter((share) => share.documentId) // Filter out null documents
      .map((share) => ({
        ...share.documentId.toObject(),
        sharedPermission: share.permission,
      }));

    // Combine both arrays and remove duplicates
    const documentMap = new Map();

    [...ownedDocuments, ...sharedDocuments].forEach((doc) => {
      const id = doc._id.toString();
      if (!documentMap.has(id)) {
        documentMap.set(id, doc);
      }
    });

    const documents = Array.from(documentMap.values());

    return NextResponse.json(
      { message: "Documents fetched successfully", documents },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching documents:", error);
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
