"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/documents.module.css";

interface Document {
  _id: string;
  title: string;
  content: string;
  owner: {
    username: string;
    email: string;
  };
  collaborators: Array<{
    username: string;
    email: string;
  }>;
  createdAt: string;
  lastEdited: string;
}

const Documents = () => {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDocument = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/documents");
      setDocuments(res.data.documents);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error || "Failed to load documents");
      if (err?.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleDocument();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading documents...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => router.push("/")} className={styles.backButton}>
          ← Back
        </button>
        <h1 className={styles.title}>My Documents</h1>
        <button className={styles.createBtn} onClick={() => router.push("/create")}>
          + New Document
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {documents.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📄</div>
          <h2>No documents yet</h2>
          <p>Create your first document to get started</p>
          <button className={styles.createBtn} onClick={() => router.push("/create")}>
            Create Document
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {documents.map((doc) => (
            <div key={doc._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{doc.title}</h2>
                <span className={styles.badge}>{doc.collaborators?.length || 0} collaborators</span>
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.meta}>
                  <span className={styles.owner}>👤 {doc.owner?.username || "Unknown"}</span>
                  <span className={styles.date}>
                    {new Date(doc.lastEdited || doc.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.actions}>
                  <button className={styles.viewBtn} onClick={() => router.push(`/documents/${doc._id}`)}>
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;