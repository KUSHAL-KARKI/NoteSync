"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import useEditorStore from "@/stores/useEditorStore";
import styles from "../../../styles/create.module.css";
import Tiptap from "@/components/editor/textEditor";

const CreatePage = () => {
  const router = useRouter();
  const { content, setContent } = useEditorStore();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // This page always starts a brand-new document, so clear any content
  // left over in the store from a previously viewed/edited document.
  useEffect(() => {
    setContent("");
  }, [setContent]);

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
      if (res.status === 201) {
        setContent(""); // clear before leaving, so /create is clean next time too
        router.push("/");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Data Creation failed");
      } else {
        setError("Data Creation failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure? Your changes will be lost.")) {
      setContent("");
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
