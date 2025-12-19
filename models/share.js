import mongoose, { Schema } from "mongoose";

const shareSchema = new Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    permission: {
      type: String,
      enum: ["read", "write"],
      default: "read",
    },
  },
  { timestamps: true }
);

// Prevent duplicate shares for same user/document
shareSchema.index({ documentId: 1, userId: 1 }, { unique: true });

const Share = mongoose.models.Share || mongoose.model("Share", shareSchema);
export default Share;
