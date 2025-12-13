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
import { useEffect, useState } from "react";
import useSocket from "@/hooks/useSocket";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface TiptapProps {
  isEditing?: boolean;
}

const Tiptap = ({ isEditing = false}: TiptapProps) => {
  const { content, setContent } = useEditorStore();
  const [typingUser, setTypingUser] = useState("");
  const {user} = useAuth();
  const socket = useSocket();
  const params = useParams();
  const docId = params.id as string;

   const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: !isEditing, // Open links in view mode
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
    content: content || "<p>Start writing...</p>",
    editable: isEditing,
    onUpdate: ({ editor }) => {
      if (!isEditing) return;
      const html = editor.getHTML();
      setContent(html);
      // realtime updates
      socket?.emit("content-update", {
        docId,
        content: html,
      });

      // typing indicator
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


  useEffect(() => {
  if (!socket || !editor) return;

  socket.emit("join-doc", docId);

socket.on("content-update", ({ content }) => {
  if (editor) {
    editor.commands.setContent(content);
  }
});


  socket.on("typing", (username) => {
    setTypingUser(username);

    // Clear after 3 sec
    setTimeout(() => setTypingUser(""), 3000);
  });

  return () => {
    socket.off("content-update");
    socket.off("typing");
  };
}, [socket, editor, docId, isEditing]);


  // Update editor editable state when isEditing changes
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
