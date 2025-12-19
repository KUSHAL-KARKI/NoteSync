"use client";

import axios from "axios";
import { useEffect, useState } from "react";

// Added a basic interface for type safety
interface Document {
  _id: string;
  title: string;
}

const ShareDoc = () => {
  const [email, setEmail] = useState<string>("");
  const [documentId, setDocumentId] = useState<string>("");
  const [documents, setDocuments] = useState<Document[]>([]);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get("/api/documents");
      setDocuments(res.data.documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };
  useEffect(() => {
    fetchDocuments();
  }, []);

  const handelSubmit = async () => {
    if (!email || !documentId) {
      alert("Please provide both an email and a document selection.");
      return;
    }

    try {
      const res = await axios.post(`/api/documents/${documentId}/share`, {
        email,
        permission: "read",
      });
      console.log("Shared successfully:", res.data);
      alert("Document shared successfully!");
    } catch (error) {
      console.error("Error sharing document:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Share Document Page</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="email"
          placeholder="Enter recipient email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handelSubmit}>Share</button>
      </div>

      <hr />

      <div>
        <h2>Select the document to share</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {documents.map((doc) => (
            <label
              key={doc._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="documentSelect"
                value={doc._id}
                checked={documentId === doc._id}
                onChange={(e) => setDocumentId(e.target.value)}
              />
              {doc.title}
            </label>
          ))}
          {documents.length === 0 && <p>No documents found.</p>}
        </div>
      </div>
    </div>
  );
};

export default ShareDoc;
