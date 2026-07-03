"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../../../../styles/documentDetail.module.css";
import useEditorStore from "@/stores/useEditorStore";
import Tiptap from "@/components/editor/textEditor";

interface DocumentData {
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

  const [doc, setDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDocument = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`/api/documents/${id}`);
        const fetchedDoc = res.data;
        setDoc(fetchedDoc);
        setContent(fetchedDoc.content || "");
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to fetch document");
        } else {
          setError("Failed to fetch document");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id, setContent]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    setDeleting(true);
    try {
      await axios.delete(`/api/documents/${id}`);
      router.push("/documents");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Failed to delete document");
      } else {
        alert("Failed to delete document");
      }
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`/api/documents/${id}`, {
        title: doc?.title,
        content: content,
      });
      setDoc((prev) => (prev ? { ...prev, content } : prev));
      alert("Document saved successfully!");
      setIsEditing(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Failed to save document");
      } else {
        alert("Failed to save document");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // revert the editor store back to the last saved content
    setContent(doc?.content || "");
    setIsEditing(false);
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

  if (!doc) {
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
              <button onClick={handleSave} className={styles.saveBtn} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={handleCancel} className={styles.cancelBtn} disabled={saving}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className={styles.editBtn}>
                Edit
              </button>
              <button onClick={handleDelete} className={styles.deleteBtn} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <Tiptap isEditing={isEditing} initialContent={doc.content} />
      </div>
    </div>
  );
}