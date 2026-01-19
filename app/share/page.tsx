"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../../styles/share.module.css";
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
 <div className={styles.container}>
  <div className={styles.wrapper}>
    <h1 className={styles.title}>Share Document</h1>

    <div className={styles.formSection}>
      <div className={styles.inputGroup}>
        <input
          type="email"
          placeholder="Enter recipient email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className={styles.shareBtn} onClick={handelSubmit}>
          Share
        </button>
      </div>
    </div>

    <hr className={styles.divider} />

    <div>
      <h2 className={styles.sectionTitle}>Select a document to share</h2>
      <div className={styles.documentList}>
        {documents.map((doc) => (
          <label
            key={doc._id}
            className={`${styles.documentCard} ${
              documentId === doc._id ? styles.selected : ""
            }`}
          >
            <input
              type="radio"
              name="documentSelect"
              value={doc._id}
              checked={documentId === doc._id}
              onChange={(e) => setDocumentId(e.target.value)}
            />
            <span className={styles.documentTitle}>{doc.title}</span>
          </label>
        ))}
        {documents.length === 0 && (
          <p className={styles.emptyState}>No documents found.</p>
        )}
      </div>
    </div>
  </div>
</div>
  );
};

export default ShareDoc;
