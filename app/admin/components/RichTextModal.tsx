"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";

interface Props {
  value: string;
  onConfirm: (html: string) => void;
  onCancel: () => void;
}

export default function RichTextModal({ value, onConfirm, onCancel }: Props) {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color, Underline],
    content: value,
    immediatelyRender: false,
  });

  if (!editor) return null;

  const btnBase =
    "px-2.5 py-1 rounded text-xs font-medium transition-colors border border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white";
  const btnActive = "bg-teal-500/20 border-teal-500/50 text-teal-300";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" dir="rtl">
      <div
        className="flex flex-col rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: "#141E28", border: "1px solid rgba(74,191,191,0.3)", width: "min(680px, 95vw)", maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-700/60 flex items-center justify-between shrink-0">
          <h2 className="text-white font-semibold text-sm">עורך טקסט עשיר</h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-white text-lg leading-none transition-colors">✕</button>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2.5 border-b border-slate-700/40 flex flex-wrap gap-1.5 items-center shrink-0" style={{ backgroundColor: "#0F1923" }}>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${btnBase} ${editor.isActive("bold") ? btnActive : ""} font-bold`}
          >B</button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${btnBase} ${editor.isActive("italic") ? btnActive : ""} italic`}
          >I</button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`${btnBase} ${editor.isActive("underline") ? btnActive : ""} underline`}
          >U</button>

          <div className="w-px h-5 bg-slate-600 mx-0.5" />

          <select
            onChange={e => {
              const v = e.target.value;
              if (v === "p") editor.chain().focus().setParagraph().run();
              else if (v === "h3") editor.chain().focus().toggleHeading({ level: 3 }).run();
              else if (v === "h2") editor.chain().focus().toggleHeading({ level: 2 }).run();
              else if (v === "h1") editor.chain().focus().toggleHeading({ level: 1 }).run();
            }}
            className="text-xs rounded border border-slate-600 bg-[#141E28] text-slate-300 px-2 py-1 focus:outline-none focus:border-teal-400"
            value={
              editor.isActive("heading", { level: 1 })
                ? "h1"
                : editor.isActive("heading", { level: 2 })
                ? "h2"
                : editor.isActive("heading", { level: 3 })
                ? "h3"
                : "p"
            }
          >
            <option value="p">רגיל</option>
            <option value="h3">קטן</option>
            <option value="h2">גדול</option>
            <option value="h1">גדול מאוד</option>
          </select>

          <div className="w-px h-5 bg-slate-600 mx-0.5" />

          <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
            <span>צבע</span>
            <input
              type="color"
              defaultValue="#4ABFBF"
              onInput={e => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
              style={{ padding: 0 }}
            />
          </label>

          <div className="w-px h-5 bg-slate-600 mx-0.5" />

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${btnBase} ${editor.isActive("bulletList") ? btnActive : ""}`}
          >≡ רשימה</button>
        </div>

        {/* Editor area */}
        <div
          className="flex-1 overflow-y-auto p-5"
          style={{ backgroundColor: "#0F1923", minHeight: 200 }}
        >
          <EditorContent
            editor={editor}
            className="prose prose-invert prose-sm max-w-none focus:outline-none min-h-[180px] text-slate-200 [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[180px]"
          />
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-slate-700/60 flex gap-2 justify-end shrink-0">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            ביטול
          </button>
          <button
            onClick={() => onConfirm(editor.getHTML())}
            className="px-5 py-2 text-sm rounded-lg bg-teal-500 hover:bg-teal-400 text-white font-semibold shadow-md shadow-teal-500/20 transition-colors"
          >
            אישור
          </button>
        </div>
      </div>
    </div>
  );
}
