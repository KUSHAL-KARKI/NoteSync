"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../../../styles/documentDetail.module.css";
import useEditorStore from "@/stores/useEditorStore";
import Tiptap from "@/components/editor/textEditor";

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

export default function Page() {
  const { content, setContent } = useEditorStore();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!id) return;

    const documentDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`/api/documents/${id}`);
        const fetchedDoc = res.data;
        setDocument(fetchedDoc);
        setContent(fetchedDoc.content || "");
      } catch (err: any) {
        console.error("Failed to fetch document details", err);
        setError(err?.response?.data?.error || "Failed to load document");
      } finally {
        setLoading(false);
      }
    };

    documentDetails();
  }, [id, setContent]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    
    try {
      await axios.delete(`/api/documents/${id}`);
      router.push("/documents");
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to delete document");
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/documents/${id}`, {
        title: document?.title,
        content: content,
      });
      alert("Document saved successfully!");
      setIsEditing(false);
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to save document");
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading document...</div>;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => router.push("/documents")} className={styles.backBtn}>
          Back to Documents
        </button>
      </div>
    );
  }

  if (!document) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>📄</div>
        <h2>Document not found</h2>
        <button onClick={() => router.push("/documents")} className={styles.backBtn}>
          Back to Documents
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button onClick={() => router.push("/documents")} className={styles.backButton}>
          ← Back
        </button>
        <div className={styles.actions}>
          {isEditing ? (
            <>
              <button onClick={handleSave} className={styles.saveBtn}>
                Save
              </button>
              <button onClick={() => setIsEditing(false)} className={styles.cancelBtn}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className={styles.editBtn}>
                Edit
              </button>
              <button onClick={handleDelete} className={styles.deleteBtn}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <Tiptap isEditing={isEditing} initialContent={document.content} />
      </div>
    </div>
  );
}