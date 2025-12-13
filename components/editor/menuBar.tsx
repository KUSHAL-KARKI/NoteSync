import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import { useCallback, useState } from "react";
import styles from "../../styles/menuBar.module.css";
import { 
  FaBold, FaCode, FaItalic, FaListOl, FaQuoteLeft, 
  FaRedo, FaUndo, FaUnderline, FaLink, FaImage, FaHighlighter,
  FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
  FaTable, FaSubscript, FaSuperscript, FaChevronDown
} from "react-icons/fa";
import { FaStrikethrough } from "react-icons/fa6";
import { LuHeading, LuHeading1, LuHeading2, LuHeading3, LuList } from "react-icons/lu";
import { RiTextBlock } from "react-icons/ri";
import { MdHorizontalRule } from "react-icons/md";

export default function MenuBar({ editor }: { editor: Editor }) {
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showListMenu, setShowListMenu] = useState(false);
  const [showAlignMenu, setShowAlignMenu] = useState(false);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isUnderline: ctx.editor.isActive("underline") ?? false,
        isStrike: ctx.editor.isActive("strike") ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive("code") ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        isHighlight: ctx.editor.isActive("highlight") ?? false,
        isSubscript: ctx.editor.isActive("subscript") ?? false,
        isSuperscript: ctx.editor.isActive("superscript") ?? false,
        isLink: ctx.editor.isActive("link") ?? false,
        isParagraph: ctx.editor.isActive("paragraph") ?? false,
        isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor.isActive("orderedList") ?? false,
        isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
        isBlockquote: ctx.editor.isActive("blockquote") ?? false,
        isAlignLeft: ctx.editor.isActive({ textAlign: 'left' }) ?? false,
        isAlignCenter: ctx.editor.isActive({ textAlign: 'center' }) ?? false,
        isAlignRight: ctx.editor.isActive({ textAlign: 'right' }) ?? false,
        isAlignJustify: ctx.editor.isActive({ textAlign: 'justify' }) ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      };
    },
  });

  const addLink = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addTable = useCallback(() => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  return (
    <div className={styles.menuBar}>
      {/* Undo/Redo */}
      <div className={styles.section}>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
          title="Undo"
        >
          <FaUndo />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
          title="Redo"
        >
          <FaRedo />
        </button>
      </div>

      <div className={styles.divider}></div>

      {/* Heading Dropdown */}
      <div className={styles.section}>
        <div className={styles.dropdown}>
          <button
            onClick={() => setShowHeadingMenu(!showHeadingMenu)}
            className={
              editorState.isHeading1 || editorState.isHeading2 || editorState.isHeading3
                ? styles.active
                : ""
            }
            title="Headings"
          >
            <LuHeading />
            <FaChevronDown className={styles.chevron} />
          </button>
          {showHeadingMenu && (
            <div className={styles.dropdownMenu}>
              <button
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 1 }).run();
                  setShowHeadingMenu(false);
                }}
                className={editorState.isHeading1 ? styles.active : ""}
              >
                <LuHeading1 /> Heading 1
              </button>
              <button
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 2 }).run();
                  setShowHeadingMenu(false);
                }}
                className={editorState.isHeading2 ? styles.active : ""}
              >
                <LuHeading2 /> Heading 2
              </button>
              <button
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 3 }).run();
                  setShowHeadingMenu(false);
                }}
                className={editorState.isHeading3 ? styles.active : ""}
              >
                <LuHeading3 /> Heading 3
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.divider}></div>

      {/* Text formatting */}
      <div className={styles.section}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={editorState.isBold ? styles.active : ""}
          title="Bold"
        >
          <FaBold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={editorState.isItalic ? styles.active : ""}
          title="Italic"
        >
          <FaItalic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={editorState.isStrike ? styles.active : ""}
          title="Strikethrough"
        >
          <FaStrikethrough />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={editorState.isCode ? styles.active : ""}
          title="Code"
        >
          <FaCode />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editorState.isUnderline ? styles.active : ""}
          title="Underline"
        >
          <FaUnderline />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={editorState.isHighlight ? styles.active : ""}
          title="Highlight"
        >
          <FaHighlighter />
        </button>
      </div>

      <div className={styles.divider}></div>

      {/* Lists Dropdown */}
      <div className={styles.section}>
        <div className={styles.dropdown}>
          <button
            onClick={() => setShowListMenu(!showListMenu)}
            className={
              editorState.isBulletList || editorState.isOrderedList
                ? styles.active
                : ""
            }
            title="Lists"
          >
            <LuList />
            <FaChevronDown className={styles.chevron} />
          </button>
          {showListMenu && (
            <div className={styles.dropdownMenu}>
              <button
                onClick={() => {
                  editor.chain().focus().toggleBulletList().run();
                  setShowListMenu(false);
                }}
                className={editorState.isBulletList ? styles.active : ""}
              >
                <LuList /> Bullet List
              </button>
              <button
                onClick={() => {
                  editor.chain().focus().toggleOrderedList().run();
                  setShowListMenu(false);
                }}
                className={editorState.isOrderedList ? styles.active : ""}
              >
                <FaListOl /> Numbered List
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editorState.isCodeBlock ? styles.active : ""}
          title="Code Block"
        >
          <RiTextBlock />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editorState.isBlockquote ? styles.active : ""}
          title="Quote"
        >
          <FaQuoteLeft />
        </button>
      </div>

      <div className={styles.divider}></div>

      {/* Alignment Dropdown */}
      <div className={styles.section}>
        <div className={styles.dropdown}>
          <button
            onClick={() => setShowAlignMenu(!showAlignMenu)}
            className={
              editorState.isAlignLeft || editorState.isAlignCenter || 
              editorState.isAlignRight || editorState.isAlignJustify
                ? styles.active
                : ""
            }
            title="Alignment"
          >
            <FaAlignLeft />
            <FaChevronDown className={styles.chevron} />
          </button>
          {showAlignMenu && (
            <div className={styles.dropdownMenu}>
              <button
                onClick={() => {
                  editor.chain().focus().setTextAlign('left').run();
                  setShowAlignMenu(false);
                }}
                className={editorState.isAlignLeft ? styles.active : ""}
              >
                <FaAlignLeft /> Align Left
              </button>
              <button
                onClick={() => {
                  editor.chain().focus().setTextAlign('center').run();
                  setShowAlignMenu(false);
                }}
                className={editorState.isAlignCenter ? styles.active : ""}
              >
                <FaAlignCenter /> Align Center
              </button>
              <button
                onClick={() => {
                  editor.chain().focus().setTextAlign('right').run();
                  setShowAlignMenu(false);
                }}
                className={editorState.isAlignRight ? styles.active : ""}
              >
                <FaAlignRight /> Align Right
              </button>
              <button
                onClick={() => {
                  editor.chain().focus().setTextAlign('justify').run();
                  setShowAlignMenu(false);
                }}
                className={editorState.isAlignJustify ? styles.active : ""}
              >
                <FaAlignJustify /> Justify
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.divider}></div>

      {/* Special formatting */}
      <div className={styles.section}>
        <button
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={editorState.isSubscript ? styles.active : ""}
          title="Subscript"
        >
          <FaSubscript />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={editorState.isSuperscript ? styles.active : ""}
          title="Superscript"
        >
          <FaSuperscript />
        </button>
      </div>

      <div className={styles.divider}></div>

      {/* Insert elements */}
      <div className={styles.section}>
        <button onClick={addLink} className={editorState.isLink ? styles.active : ""} title="Insert Link">
          <FaLink />
        </button>
        <button onClick={addImage} title="Insert Image">
          <FaImage />
        </button>
        <button onClick={addTable} title="Insert Table">
          <FaTable />
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Line"
        >
          <MdHorizontalRule />
        </button>
      </div>
    </div>
  );
}