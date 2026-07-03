"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { TableKit } from "@tiptap/extension-table";
import { TextStyleKit } from "@tiptap/extension-text-style";
import MenuBar from "../editor/menuBar";
import styles from "../../styles/textEditor.module.css";
import useEditorStore from "@/stores/useEditorStore";
import { useEffect, useRef, useState } from "react";
import useSocket from "@/hooks/useSocket";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface TiptapProps {
  isEditing?: boolean;
  initialContent?: string;
}

interface TypingPayload {
  docId: string;
  username: string;
}

const Tiptap = ({ isEditing = false, initialContent }: TiptapProps) => {
  const { content, setContent } = useEditorStore();
  const [typingUser, setTypingUser] = useState("");
  const { user } = useAuth();
  const socket = useSocket();
  const params = useParams();
  const docId = params.id as string;
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: !isEditing,
        HTMLAttributes: {
          class: "link",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "editor-image",
        },
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Subscript,
      Superscript,
      TextStyleKit,
      TableKit,
    ],
    content: initialContent || content || "<p>Start writing...</p>",
    editable: isEditing,
    onUpdate: ({ editor }) => {
      if (!isEditing) return;
      const html = editor.getHTML();
      setContent(html);

      socket?.emit("content-update", {
        docId,
        content: html,
      });

      socket?.emit("typing", {
        docId,
        username: user?.username,
      });
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: isEditing ? styles.editorContent : styles.editorContentView,
      },
    },
  });

  // Sync editor content when it arrives from the store/props after mount
  // (e.g. after an async fetch resolves). Skip while the user is actively
  // focused/editing so we don't clobber their cursor mid-keystroke.
  useEffect(() => {
    if (!editor) return;
    const incoming = initialContent || content;
    if (incoming && incoming !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, initialContent, content]);

  useEffect(() => {
    if (!socket || !editor) return;

    socket.emit("join-doc", docId);

    socket.on("content-update", ({ content: incoming }: { content: string }) => {
      if (editor && !editor.isFocused) {
        editor.commands.setContent(incoming, { emitUpdate: false });
      }
    });

    socket.on("typing", ({ username }: TypingPayload) => {
      setTypingUser(username);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => setTypingUser(""), 3000);
    });

    return () => {
      socket.off("content-update");
      socket.off("typing");
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [socket, editor, docId]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing);
    }
  }, [editor, isEditing]);

  if (!editor) {
    return <div className={styles.loading}>Loading editor...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.editorWrapper}>
        {isEditing && <MenuBar editor={editor} />}
        <EditorContent editor={editor} className={styles.editor} />
        {typingUser && (
          <div className={styles.typingIndicator}>
            {typingUser} is typing...
          </div>
        )}
      </div>
    </div>
  );
};

export default Tiptap;