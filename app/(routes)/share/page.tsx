"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../../../styles/share.module.css";

interface DocumentItem {
  _id: string;
  title: string;
}

const ShareDoc = () => {
  const [email, setEmail] = useState<string>("");
  const [documentId, setDocumentId] = useState<string>("");
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loadingDocs, setLoadingDocs] = useState<boolean>(true);
  const [sharing, setSharing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchDocuments = async () => {
    setLoadingDocs(true);
    try {
      const res = await axios.get("/api/documents");
      setDocuments(res.data.documents);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to fetch documents");
      } else {
        setError("Failed to fetch documents");
      }
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (!email || !documentId) {
      setError("Please provide both an email and a document selection.");
      return;
    }

    setSharing(true);
    try {
      await axios.post(`/api/documents/${documentId}/share`, {
        email,
        permission: "read",
      });
      setSuccess("Document shared successfully!");
      setEmail("");
      setDocumentId("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Error sharing document");
      } else {
        setError("Error sharing document");
      }
    } finally {
      setSharing(false);
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
            <button
              className={styles.shareBtn}
              onClick={handleSubmit}
              disabled={sharing}
            >
              {sharing ? "Sharing..." : "Share"}
            </button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
        </div>

        <hr className={styles.divider} />

        <div>
          <h2 className={styles.sectionTitle}>Select a document to share</h2>
          <div className={styles.documentList}>
            {loadingDocs ? (
              <p className={styles.emptyState}>Loading documents...</p>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareDoc;