"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import useEditorStore from "@/stores/useEditorStore";
import styles from "../../styles/create.module.css";
import Tiptap from "@/components/editor/textEditor";

const CreatePage = () => {
  const router = useRouter();
  const { content } = useEditorStore();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }
    if (!content.trim() || content === "<p></p>") {
      setError("Please add some content");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/documents", {
        title,
        content,
      });
      router.push("/");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create document");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure? Your changes will be lost.")) {
      router.push("/");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Document Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.titleInput}
        />
        <div className={styles.actions}>
          <button
            onClick={handleSave}
            disabled={loading}
            className={styles.saveBtn}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button onClick={handleCancel} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <Tiptap isEditing={true} initialContent="" />
      
    </div>
  );
};

export default CreatePage;
