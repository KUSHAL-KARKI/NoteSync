import mongoose, { Schema } from "mongoose";

const documentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    lastEdited: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "lastEdited" },
  }
);

const Document =
  mongoose.models.Document || mongoose.model("Document", documentSchema);

export default Document;
