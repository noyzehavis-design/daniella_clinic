"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { SiteContent } from "@/app/lib/content";
import { useContent } from "@/app/lib/ContentContext";
import ImageEditorModal from "./components/ImageEditorModal";
import RichTextModal from "./components/RichTextModal";

// ─── Helper Components ────────────────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  rows,
  onRichText,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  onRichText?: () => void;
}) {
  const cls =
    "w-full bg-[#0F1923] border border-slate-600/60 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400 transition-colors";
  const showRichText = onRichText && rows && rows >= 3;
  return (
    <div className="mb-2.5">
      {label && (
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-medium text-slate-400">{label}</label>
          {showRichText && (
            <button
              type="button"
              onClick={onRichText}
              title="עריכת טקסט עשיר"
              className="text-xs text-teal-400 hover:text-teal-300 border border-teal-500/30 rounded px-1.5 py-0.5 hover:bg-teal-500/10 transition-colors"
            >
              T עיצוב
            </button>
          )}
        </div>
      )}
      {rows ? (
        <textarea
          className={cls}
          value={value}
          rows={rows}
          onChange={e => onChange(e.target.value)}
        />
      ) : (
        <input className={cls} value={value} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  onRichText,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onRichText?: () => void;
}) {
  return (
    <div className="mb-2.5">
      <div className="flex items-center justify-between mb-1">
        <label className="block text-xs font-medium text-slate-400">{label}</label>
        {onRichText && (
          <button
            type="button"
            onClick={onRichText}
            title="עריכת טקסט עשיר"
            className="text-xs text-teal-400 hover:text-teal-300 border border-teal-500/30 rounded px-1.5 py-0.5 hover:bg-teal-500/10 transition-colors"
          >
            T עיצוב
          </button>
        )}
      </div>
      <textarea
        rows={4}
        className="w-full bg-[#0F1923] border border-slate-600/60 rounded-lg px-3 py-2 text-white text-sm resize-y focus:outline-none focus:border-teal-400 transition-colors"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

function ImageUpload({
  label,
  value,
  onChange,
  hint,
  onCrop,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  onCrop: (src: string, cb: (b64: string) => void) => void;
}) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      onCrop(dataUrl, onChange);
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
      <input type="file" accept="image/*" onChange={handleFile} className="text-xs text-slate-400 mb-1 block" />
      <p className="text-xs text-slate-500 mb-1">{hint ?? "עד 2MB · JPG / PNG / WebP"}</p>
      {value && (
        <div className="mt-2 flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" className="h-24 rounded-lg object-cover border border-slate-700 flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => onCrop(value, onChange)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-teal-500/20 hover:bg-teal-500/40 text-teal-400 text-xs transition-colors"
              title="ערוך תמונה"
            >
              ✎
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-700 hover:bg-red-500/80 text-slate-300 hover:text-white text-sm transition-colors"
              title="הסר תמונה"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ArrayEditor<T>({
  items,
  renderItem,
  onAdd,
  onDelete,
  onMove,
}: {
  items: T[];
  renderItem: (item: T, i: number) => React.ReactNode;
  onAdd: () => void;
  onDelete: (i: number) => void;
  onMove: (i: number, dir: -1 | 1) => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start p-3 bg-[#0F1923]/80 border border-slate-700/40 rounded-lg">
          <div className="flex-1">{renderItem(item, i)}</div>
          <div className="flex flex-col gap-1 pt-0.5">
            <button
              onClick={() => onMove(i, -1)}
              className="w-6 h-6 flex items-center justify-center rounded-md text-slate-500 hover:text-white hover:bg-slate-700 text-xs transition-colors"
            >↑</button>
            <button
              onClick={() => onMove(i, 1)}
              className="w-6 h-6 flex items-center justify-center rounded-md text-slate-500 hover:text-white hover:bg-slate-700 text-xs transition-colors"
            >↓</button>
            <button
              onClick={() => onDelete(i)}
              className="w-6 h-6 flex items-center justify-center rounded-md text-slate-500 hover:text-white hover:bg-red-500/70 text-xs transition-colors"
            >✕</button>
          </div>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="mt-1 px-3 py-1.5 text-xs font-medium text-teal-400 border border-teal-500/40 rounded-lg hover:bg-teal-500/10 transition-colors"
      >
        + הוסף
      </button>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 text-base font-semibold text-white mb-5">
      <span className="w-1 h-5 rounded-full bg-teal-500 shrink-0" />
      {children}
    </h2>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-medium text-slate-400 mt-3 mb-2">{children}</p>;
}

function SaveButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="mt-5 px-5 py-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg shadow-md shadow-teal-500/20 transition-all flex items-center gap-2"
    >
      {disabled && (
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      )}
      שמור שינויים
    </button>
  );
}

// ─── Admin Page ───────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const { content, setContent } = useContent();
  const [draft, setDraft] = useState<SiteContent>(content);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("section-hero");

  // Image crop state
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropCallback, setCropCallback] = useState<((b64: string) => void) | null>(null);

  // Rich text modal state
  const [rtValue, setRtValue] = useState<string | null>(null);
  const [rtCallback, setRtCallback] = useState<((html: string) => void) | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("adminAuth") === "true") setAuthenticated(true);
  }, []);

  useEffect(() => {
    setDraft(content);
    setIsDirty(false);
  }, [content]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const save = async () => {
    setIsSaving(true);
    try {
      await setContent(draft);
      setIsDirty(false);
      showToast("נשמר בהצלחה! ✓");
    } catch {
      showToast("שגיאה בשמירה — נסה שוב", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogin = () => {
    if (password === "123456") {
      sessionStorage.setItem("adminAuth", "true");
      setAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  function updateDraft<K extends keyof SiteContent>(key: K, val: SiteContent[K]) {
    setDraft(prev => ({ ...prev, [key]: val }));
    setIsDirty(true);
  }

  // Helpers for crop modal
  const openCrop = (src: string, cb: (b64: string) => void) => {
    setCropSrc(src);
    setCropCallback(() => cb);
  };

  // Helpers for rich text modal
  const openRichText = (value: string, cb: (html: string) => void) => {
    setRtValue(value);
    setRtCallback(() => cb);
  };

  // ─── Login Screen ─────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#0F1923" }}
        dir="rtl"
      >
        <div
          className="rounded-2xl p-10 w-full max-w-sm flex flex-col items-center gap-6 shadow-2xl"
          style={{ backgroundColor: "#141E28", border: "1px solid rgba(74,191,191,0.2)" }}
        >
          <Image src="/clinic-logo.png" alt="לוגו" width={140} height={52} className="object-contain" />
          <h1 className="text-white text-2xl font-bold">כניסה לניהול</h1>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="סיסמה"
            className="w-full bg-[#0F1923] border border-slate-600/60 rounded-lg px-4 py-3 text-white text-center focus:outline-none focus:border-teal-400 transition-colors"
          />
          {authError && <p className="text-red-400 text-sm">סיסמה שגויה</p>}
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-lg shadow-md shadow-teal-500/20 transition-all"
          >
            כניסה
          </button>
        </div>
      </div>
    );
  }

  // ─── Dashboard ────────────────────────────────────────────────────────────

  const navSections = [
    { id: "section-hero", label: "כותרת ראשית" },
    { id: "section-trust", label: "פס אמון" },
    { id: "section-service", label: "שירות" },
    { id: "section-about", label: "על דניאלה" },
    { id: "section-patients", label: "מטופלים" },
    { id: "section-clinic", label: "המרפאה" },
    { id: "section-testimonials", label: "המלצות" },
    { id: "section-staff", label: "צוות" },
    { id: "section-videos", label: "סרטונים" },
    { id: "section-faq", label: "שאלות נפוצות" },
    { id: "section-form-inline", label: "טופס מרכז" },
    { id: "section-form-footer", label: "טופס תחתית" },
    { id: "section-clinicinfo", label: "פרטי מרפאה" },
    { id: "section-typography", label: "גודל גופן" },
  ];

  return (
    <div dir="rtl" style={{ backgroundColor: "#0F1923", minHeight: "100vh" }} className="flex">

      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col w-60 shrink-0 border-l border-slate-700/60"
        style={{ backgroundColor: "#141E28", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}
      >
        <div className="p-5 border-b border-slate-700/60 flex flex-col items-center gap-3">
          <Image src="/clinic-logo.png" alt="לוגו" width={110} height={42} className="object-contain" />
          <div className="w-full flex items-center justify-between">
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">מנהל</span>
            <button
              onClick={() => {
                sessionStorage.removeItem("adminAuth");
                setAuthenticated(false);
              }}
              className="text-xs text-slate-400 hover:text-red-400 transition-colors"
            >
              התנתקות
            </button>
          </div>
        </div>
        <nav className="p-3 flex flex-col gap-0.5">
          {navSections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`group flex items-center gap-2 text-sm py-2 px-3 rounded-lg transition-colors text-right w-full ${
                activeSection === s.id
                  ? "border-r-2 border-teal-400 text-teal-400 bg-teal-500/10"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <span
                className={`w-0.5 h-4 rounded-full bg-teal-500 shrink-0 transition-opacity ${
                  activeSection === s.id ? "opacity-0" : "opacity-0 group-hover:opacity-100"
                }`}
              />
              {s.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-5 md:p-8 max-w-2xl">

        {/* Header bar */}
        <div className="flex items-center justify-between mb-7">
          <h1 className="text-lg font-bold text-white">לוח בקרה</h1>
          <span className="text-xs text-slate-500">מערכת ניהול תוכן</span>
        </div>

        {/* === HERO === */}
        {activeSection === "section-hero" && (
          <div className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
            <SectionTitle>כותרת ראשית (Hero)</SectionTitle>
            <Field label="כותרת" value={draft.hero.heading} onChange={v => updateDraft("hero", { ...draft.hero, heading: v })} />
            <Field label="תת-כותרת" value={draft.hero.subheading} onChange={v => updateDraft("hero", { ...draft.hero, subheading: v })} />
            <Field label="טקסט כפתור" value={draft.hero.ctaText} onChange={v => updateDraft("hero", { ...draft.hero, ctaText: v })} />
            <ImageUpload
              label="תמונת רקע"
              value={draft.hero.backgroundImage}
              onChange={v => updateDraft("hero", { ...draft.hero, backgroundImage: v })}
              hint="רוחב: 1920px · יחס 16:9 · עד 3MB · JPG/WebP"
              onCrop={openCrop}
            />
            <Field
              label="YouTube URL לרקע הוידאו (אופציונלי)"
              value={draft.hero.videoUrl ?? ""}
              onChange={v => updateDraft("hero", { ...draft.hero, videoUrl: v })}
            />
            <p className="text-xs text-slate-500 -mt-2 mb-3">
              הדבק קישור YouTube — לדוגמה: https://www.youtube.com/watch?v=XXXXX
            </p>
            <SaveButton onClick={save} disabled={isSaving} />
          </div>
        )}

        {/* === TRUST BAR === */}
        {activeSection === "section-trust" && (
          <div className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
            <SectionTitle>פס אמון</SectionTitle>
            <ArrayEditor
              items={draft.trustBar.items}
              renderItem={(item, i) => (
                <div>
                  <Field label="אייקון" value={item.icon} onChange={v => {
                    const items = [...draft.trustBar.items];
                    items[i] = { ...items[i], icon: v };
                    updateDraft("trustBar", { items });
                  }} />
                  <Field label="מספר (אופציונלי)" value={item.number ?? ""} onChange={v => {
                    const items = [...draft.trustBar.items];
                    items[i] = { ...items[i], number: v };
                    updateDraft("trustBar", { items });
                  }} />
                  <Field label="טקסט גדול (אופציונלי)" value={item.text ?? ""} onChange={v => {
                    const items = [...draft.trustBar.items];
                    items[i] = { ...items[i], text: v || undefined };
                    updateDraft("trustBar", { items });
                  }} />
                  <Field label="תווית" value={item.label} onChange={v => {
                    const items = [...draft.trustBar.items];
                    items[i] = { ...items[i], label: v };
                    updateDraft("trustBar", { items });
                  }} />
                </div>
              )}
              onAdd={() => updateDraft("trustBar", { items: [...draft.trustBar.items, { icon: "FaTooth", label: "" }] })}
              onDelete={i => updateDraft("trustBar", { items: draft.trustBar.items.filter((_, idx) => idx !== i) })}
              onMove={(i, dir) => {
                const items = [...draft.trustBar.items];
                const j = i + dir;
                if (j < 0 || j >= items.length) return;
                [items[i], items[j]] = [items[j], items[i]];
                updateDraft("trustBar", { items });
              }}
            />
            <SaveButton onClick={save} disabled={isSaving} />
          </div>
        )}

        {/* === SERVICE === */}
        {activeSection === "section-service" && (
          <div className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
            <SectionTitle>שירות</SectionTitle>
            <Field label="תג" value={draft.service.tag} onChange={v => updateDraft("service", { ...draft.service, tag: v })} />
            <Field label="כותרת" value={draft.service.heading} onChange={v => updateDraft("service", { ...draft.service, heading: v })} />
            <TextArea
              label="תיאור"
              value={draft.service.description}
              onChange={v => updateDraft("service", { ...draft.service, description: v })}
              onRichText={() => openRichText(draft.service.description, v => updateDraft("service", { ...draft.service, description: v }))}
            />
            <SubLabel>נקודות עיקריות</SubLabel>
            <ArrayEditor
              items={draft.service.bullets}
              renderItem={(item, i) => (
                <Field label="" value={item} onChange={v => {
                  const bullets = [...draft.service.bullets];
                  bullets[i] = v;
                  updateDraft("service", { ...draft.service, bullets });
                }} />
              )}
              onAdd={() => updateDraft("service", { ...draft.service, bullets: [...draft.service.bullets, ""] })}
              onDelete={i => updateDraft("service", { ...draft.service, bullets: draft.service.bullets.filter((_, idx) => idx !== i) })}
              onMove={(i, dir) => {
                const bullets = [...draft.service.bullets];
                const j = i + dir;
                if (j < 0 || j >= bullets.length) return;
                [bullets[i], bullets[j]] = [bullets[j], bullets[i]];
                updateDraft("service", { ...draft.service, bullets });
              }}
            />
            <ImageUpload
              label="תמונה"
              value={draft.service.image}
              onChange={v => updateDraft("service", { ...draft.service, image: v })}
              hint="יחס 4:3 מומלץ · עד 2MB · JPG/PNG/WebP"
              onCrop={openCrop}
            />
            <SaveButton onClick={save} disabled={isSaving} />
          </div>
        )}

        {/* === ABOUT === */}
        {activeSection === "section-about" && (
          <div className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
            <SectionTitle>על דניאלה</SectionTitle>
            <Field label="שם" value={draft.about.name} onChange={v => updateDraft("about", { ...draft.about, name: v })} />
            <Field label="תפקיד" value={draft.about.title} onChange={v => updateDraft("about", { ...draft.about, title: v })} />
            <TextArea
              label="ביוגרפיה"
              value={draft.about.bio}
              onChange={v => updateDraft("about", { ...draft.about, bio: v })}
              onRichText={() => openRichText(draft.about.bio, v => updateDraft("about", { ...draft.about, bio: v }))}
            />
            <Field label="טקסט כפתור" value={draft.about.ctaText} onChange={v => updateDraft("about", { ...draft.about, ctaText: v })} />
            <ImageUpload
              label="תמונה"
              value={draft.about.image}
              onChange={v => updateDraft("about", { ...draft.about, image: v })}
              hint="פורטרט (3:4) · עד 1MB · JPG/PNG/WebP"
              onCrop={openCrop}
            />
            <SubLabel>נקודות חוזק</SubLabel>
            <ArrayEditor
              items={draft.about.strengths}
              renderItem={(item, i) => (
                <div>
                  <Field label="אייקון" value={item.icon} onChange={v => {
                    const strengths = [...draft.about.strengths];
                    strengths[i] = { ...strengths[i], icon: v };
                    updateDraft("about", { ...draft.about, strengths });
                  }} />
                  <Field label="תווית" value={item.label} onChange={v => {
                    const strengths = [...draft.about.strengths];
                    strengths[i] = { ...strengths[i], label: v };
                    updateDraft("about", { ...draft.about, strengths });
                  }} />
                </div>
              )}
              onAdd={() => updateDraft("about", { ...draft.about, strengths: [...draft.about.strengths, { icon: "FaTooth", label: "" }] })}
              onDelete={i => updateDraft("about", { ...draft.about, strengths: draft.about.strengths.filter((_, idx) => idx !== i) })}
              onMove={(i, dir) => {
                const strengths = [...draft.about.strengths];
                const j = i + dir;
                if (j < 0 || j >= strengths.length) return;
                [strengths[i], strengths[j]] = [strengths[j], strengths[i]];
                updateDraft("about", { ...draft.about, strengths });
              }}
            />
            <SaveButton onClick={save} disabled={isSaving} />
          </div>
        )}

        {/* === PATIENTS === */}
        {activeSection === "section-patients" && (
          <div className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
            <SectionTitle>תמונות מטופלים</SectionTitle>
            <Field
              label="כותרת"
              value={draft.patients.heading}
              onChange={v => updateDraft("patients", { ...draft.patients, heading: v })}
            />
            <Field
              label="תת-כותרת"
              value={draft.patients.subheading}
              onChange={v => updateDraft("patients", { ...draft.patients, subheading: v })}
            />
            <ArrayEditor
              items={draft.patients.images}
              renderItem={(item, i) => (
                <div>
                  <ImageUpload
                    label="תמונה"
                    value={item.src}
                    onChange={v => {
                      const images = [...draft.patients.images];
                      images[i] = { ...images[i], src: v };
                      updateDraft("patients", { ...draft.patients, images });
                    }}
                    hint="ריבועי מומלץ (1:1) · עד 1MB · JPG/PNG/WebP"
                    onCrop={openCrop}
                  />
                  <Field label="כיתוב" value={item.caption} onChange={v => {
                    const images = [...draft.patients.images];
                    images[i] = { ...images[i], caption: v };
                    updateDraft("patients", { ...draft.patients, images });
                  }} />
                </div>
              )}
              onAdd={() => updateDraft("patients", { ...draft.patients, images: [...draft.patients.images, { src: "", caption: "" }] })}
              onDelete={i => updateDraft("patients", { ...draft.patients, images: draft.patients.images.filter((_, idx) => idx !== i) })}
              onMove={(i, dir) => {
                const images = [...draft.patients.images];
                const j = i + dir;
                if (j < 0 || j >= images.length) return;
                [images[i], images[j]] = [images[j], images[i]];
                updateDraft("patients", { ...draft.patients, images });
              }}
            />
            <SaveButton onClick={save} disabled={isSaving} />
          </div>
        )}

        {/* === CLINIC SECTION === */}
        {activeSection === "section-clinic" && (
          <div className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
            <SectionTitle>המרפאה</SectionTitle>
            <Field label="כותרת" value={draft.clinic_section.heading} onChange={v => updateDraft("clinic_section", { ...draft.clinic_section, heading: v })} />
            <Field label="תת-כותרת" value={draft.clinic_section.subheading} onChange={v => updateDraft("clinic_section", { ...draft.clinic_section, subheading: v })} />
            <Field
              label="פסקה"
              value={draft.clinic_section.paragraph}
              onChange={v => updateDraft("clinic_section", { ...draft.clinic_section, paragraph: v })}
              rows={3}
              onRichText={() => openRichText(draft.clinic_section.paragraph, v => updateDraft("clinic_section", { ...draft.clinic_section, paragraph: v }))}
            />
            <Field label="כותרת באנר" value={draft.clinic_section.ctaText} onChange={v => updateDraft("clinic_section", { ...draft.clinic_section, ctaText: v })} />
            <Field label="טקסט כפתור" value={draft.clinic_section.ctaButtonText} onChange={v => updateDraft("clinic_section", { ...draft.clinic_section, ctaButtonText: v })} />

            <SubLabel>צוות</SubLabel>
            <ArrayEditor
              items={draft.clinic_section.team}
              renderItem={(item, i) => (
                <div>
                  <Field label="שם" value={item.name} onChange={v => {
                    const team = [...draft.clinic_section.team];
                    team[i] = { ...team[i], name: v };
                    updateDraft("clinic_section", { ...draft.clinic_section, team });
                  }} />
                  <Field label="תפקיד" value={item.role} onChange={v => {
                    const team = [...draft.clinic_section.team];
                    team[i] = { ...team[i], role: v };
                    updateDraft("clinic_section", { ...draft.clinic_section, team });
                  }} />
                  <ImageUpload
                    label="תמונה"
                    value={item.image}
                    onChange={v => {
                      const team = [...draft.clinic_section.team];
                      team[i] = { ...team[i], image: v };
                      updateDraft("clinic_section", { ...draft.clinic_section, team });
                    }}
                    hint="פורטרט (3:4) · עד 1MB · JPG/PNG/WebP"
                    onCrop={openCrop}
                  />
                </div>
              )}
              onAdd={() => updateDraft("clinic_section", { ...draft.clinic_section, team: [...draft.clinic_section.team, { name: "", role: "", image: "" }] })}
              onDelete={i => updateDraft("clinic_section", { ...draft.clinic_section, team: draft.clinic_section.team.filter((_, idx) => idx !== i) })}
              onMove={(i, dir) => {
                const team = [...draft.clinic_section.team];
                const j = i + dir;
                if (j < 0 || j >= team.length) return;
                [team[i], team[j]] = [team[j], team[i]];
                updateDraft("clinic_section", { ...draft.clinic_section, team });
              }}
            />

            <SubLabel>טכנולוגיה</SubLabel>
            <ArrayEditor
              items={draft.clinic_section.tech}
              renderItem={(item, i) => (
                <div>
                  <Field label="אייקון" value={item.icon} onChange={v => {
                    const tech = [...draft.clinic_section.tech];
                    tech[i] = { ...tech[i], icon: v };
                    updateDraft("clinic_section", { ...draft.clinic_section, tech });
                  }} />
                  <Field label="שם" value={item.label} onChange={v => {
                    const tech = [...draft.clinic_section.tech];
                    tech[i] = { ...tech[i], label: v };
                    updateDraft("clinic_section", { ...draft.clinic_section, tech });
                  }} />
                  <Field label="תיאור" value={item.description} onChange={v => {
                    const tech = [...draft.clinic_section.tech];
                    tech[i] = { ...tech[i], description: v };
                    updateDraft("clinic_section", { ...draft.clinic_section, tech });
                  }} />
                </div>
              )}
              onAdd={() => updateDraft("clinic_section", { ...draft.clinic_section, tech: [...draft.clinic_section.tech, { icon: "FaTooth", label: "", description: "" }] })}
              onDelete={i => updateDraft("clinic_section", { ...draft.clinic_section, tech: draft.clinic_section.tech.filter((_, idx) => idx !== i) })}
              onMove={(i, dir) => {
                const tech = [...draft.clinic_section.tech];
                const j = i + dir;
                if (j < 0 || j >= tech.length) return;
                [tech[i], tech[j]] = [tech[j], tech[i]];
                updateDraft("clinic_section", { ...draft.clinic_section, tech });
              }}
            />
            <SaveButton onClick={save} disabled={isSaving} />
          </div>
        )}

        {/* === TESTIMONIALS === */}
        {activeSection === "section-testimonials" && (
          <div className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
            <SectionTitle>המלצות</SectionTitle>
            <ArrayEditor
              items={draft.testimonials.items}
              renderItem={(item, i) => (
                <div>
                  <TextArea
                    label="טקסט"
                    value={item.text}
                    onChange={v => {
                      const items = [...draft.testimonials.items];
                      items[i] = { ...items[i], text: v };
                      updateDraft("testimonials", { ...draft.testimonials, items });
                    }}
                    onRichText={() => openRichText(item.text, v => {
                      const items = [...draft.testimonials.items];
                      items[i] = { ...items[i], text: v };
                      updateDraft("testimonials", { ...draft.testimonials, items });
                    })}
                  />
                  <Field label="שם" value={item.name} onChange={v => {
                    const items = [...draft.testimonials.items];
                    items[i] = { ...items[i], name: v };
                    updateDraft("testimonials", { ...draft.testimonials, items });
                  }} />
                  <Field label="מקור" value={item.source} onChange={v => {
                    const items = [...draft.testimonials.items];
                    items[i] = { ...items[i], source: v };
                    updateDraft("testimonials", { ...draft.testimonials, items });
                  }} />
                </div>
              )}
              onAdd={() => updateDraft("testimonials", { ...draft.testimonials, items: [...draft.testimonials.items, { text: "", name: "", source: "google" }] })}
              onDelete={i => updateDraft("testimonials", { ...draft.testimonials, items: draft.testimonials.items.filter((_, idx) => idx !== i) })}
              onMove={(i, dir) => {
                const items = [...draft.testimonials.items];
                const j = i + dir;
                if (j < 0 || j >= items.length) return;
                [items[i], items[j]] = [items[j], items[i]];
                updateDraft("testimonials", { ...draft.testimonials, items });
              }}
            />
            <SaveButton onClick={save} disabled={isSaving} />
          </div>
        )}

        {/* === STAFF SPLIT === */}
        {activeSection === "section-staff" && (
          <div className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
            <SectionTitle>צוות (חלוקה)</SectionTitle>

            <p className="text-xs font-semibold text-teal-400 mb-3">פאנל ימין</p>
            <Field label="שם" value={draft.staff_split.left.name} onChange={v => updateDraft("staff_split", { ...draft.staff_split, left: { ...draft.staff_split.left, name: v } })} />
            <Field label="תפקיד" value={draft.staff_split.left.role} onChange={v => updateDraft("staff_split", { ...draft.staff_split, left: { ...draft.staff_split.left, role: v } })} />
            <Field label="טקסט כפתור" value={draft.staff_split.left.ctaText} onChange={v => updateDraft("staff_split", { ...draft.staff_split, left: { ...draft.staff_split.left, ctaText: v } })} />
            <ImageUpload
              label="תמונה"
              value={draft.staff_split.left.image}
              onChange={v => updateDraft("staff_split", { ...draft.staff_split, left: { ...draft.staff_split.left, image: v } })}
              hint="פורטרט (3:4) · עד 1MB · JPG/PNG/WebP"
              onCrop={openCrop}
            />
            <SubLabel>נקודות</SubLabel>
            <ArrayEditor
              items={draft.staff_split.left.bullets}
              renderItem={(item, i) => (
                <Field label="" value={item} onChange={v => {
                  const bullets = [...draft.staff_split.left.bullets];
                  bullets[i] = v;
                  updateDraft("staff_split", { ...draft.staff_split, left: { ...draft.staff_split.left, bullets } });
                }} />
              )}
              onAdd={() => updateDraft("staff_split", { ...draft.staff_split, left: { ...draft.staff_split.left, bullets: [...draft.staff_split.left.bullets, ""] } })}
              onDelete={i => updateDraft("staff_split", { ...draft.staff_split, left: { ...draft.staff_split.left, bullets: draft.staff_split.left.bullets.filter((_, idx) => idx !== i) } })}
              onMove={(i, dir) => {
                const bullets = [...draft.staff_split.left.bullets];
                const j = i + dir;
                if (j < 0 || j >= bullets.length) return;
                [bullets[i], bullets[j]] = [bullets[j], bullets[i]];
                updateDraft("staff_split", { ...draft.staff_split, left: { ...draft.staff_split.left, bullets } });
              }}
            />

            <p className="text-xs font-semibold text-teal-400 mt-6 mb-3">פאנל שמאל</p>
            <Field label="שם" value={draft.staff_split.right.name} onChange={v => updateDraft("staff_split", { ...draft.staff_split, right: { ...draft.staff_split.right, name: v } })} />
            <Field label="תפקיד" value={draft.staff_split.right.role} onChange={v => updateDraft("staff_split", { ...draft.staff_split, right: { ...draft.staff_split.right, role: v } })} />
            <Field label="טקסט כפתור" value={draft.staff_split.right.ctaText} onChange={v => updateDraft("staff_split", { ...draft.staff_split, right: { ...draft.staff_split.right, ctaText: v } })} />
            <ImageUpload
              label="תמונה"
              value={draft.staff_split.right.image}
              onChange={v => updateDraft("staff_split", { ...draft.staff_split, right: { ...draft.staff_split.right, image: v } })}
              hint="פורטרט (3:4) · עד 1MB · JPG/PNG/WebP"
              onCrop={openCrop}
            />
            <SubLabel>נקודות</SubLabel>
            <ArrayEditor
              items={draft.staff_split.right.bullets}
              renderItem={(item, i) => (
                <Field label="" value={item} onChange={v => {
                  const bullets = [...draft.staff_split.right.bullets];
                  bullets[i] = v;
                  updateDraft("staff_split", { ...draft.staff_split, right: { ...draft.staff_split.right, bullets } });
                }} />
              )}
              onAdd={() => updateDraft("staff_split", { ...draft.staff_split, right: { ...draft.staff_split.right, bullets: [...draft.staff_split.right.bullets, ""] } })}
              onDelete={i => updateDraft("staff_split", { ...draft.staff_split, right: { ...draft.staff_split.right, bullets: draft.staff_split.right.bullets.filter((_, idx) => idx !== i) } })}
              onMove={(i, dir) => {
                const bullets = [...draft.staff_split.right.bullets];
                const j = i + dir;
                if (j < 0 || j >= bullets.length) return;
                [bullets[i], bullets[j]] = [bullets[j], bullets[i]];
                updateDraft("staff_split", { ...draft.staff_split, right: { ...draft.staff_split.right, bullets } });
              }}
            />
            <SaveButton onClick={save} disabled={isSaving} />
          </div>
        )}

        {/* === VIDEOS === */}
        {activeSection === "section-videos" && (
          <div className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
            <SectionTitle>סרטונים</SectionTitle>
            <ArrayEditor
              items={draft.videos.items}
              renderItem={(item, i) => (
                <div>
                  <Field label="YouTube ID" value={item.youtubeId} onChange={v => {
                    const items = [...draft.videos.items];
                    items[i] = { ...items[i], youtubeId: v };
                    updateDraft("videos", { ...draft.videos, items });
                  }} />
                  <Field label="כותרת" value={item.title} onChange={v => {
                    const items = [...draft.videos.items];
                    items[i] = { ...items[i], title: v };
                    updateDraft("videos", { ...draft.videos, items });
                  }} />
                  {item.youtubeId && !item.youtubeId.startsWith("PLACEHOLDER") && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                      alt="thumbnail"
                      className="mt-2 h-20 rounded-lg object-cover border border-slate-700"
                    />
                  )}
                </div>
              )}
              onAdd={() => updateDraft("videos", { ...draft.videos, items: [...draft.videos.items, { youtubeId: "", title: "" }] })}
              onDelete={i => updateDraft("videos", { ...draft.videos, items: draft.videos.items.filter((_, idx) => idx !== i) })}
              onMove={(i, dir) => {
                const items = [...draft.videos.items];
                const j = i + dir;
                if (j < 0 || j >= items.length) return;
                [items[i], items[j]] = [items[j], items[i]];
                updateDraft("videos", { ...draft.videos, items });
              }}
            />
            <SaveButton onClick={save} disabled={isSaving} />
          </div>
        )}

        {/* === FAQ === */}
        {activeSection === "section-faq" && (
          <div className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
            <SectionTitle>שאלות נפוצות</SectionTitle>
            <Field
              label="כותרת"
              value={draft.faq.heading}
              onChange={v => updateDraft("faq", { ...draft.faq, heading: v })}
            />
            <ArrayEditor
              items={draft.faq.items}
              renderItem={(item, i) => (
                <div>
                  <Field label="שאלה" value={item.question} onChange={v => {
                    const items = [...draft.faq.items];
                    items[i] = { ...items[i], question: v };
                    updateDraft("faq", { ...draft.faq, items });
                  }} />
                  <Field label="תשובה" value={item.answer} rows={3} onChange={v => {
                    const items = [...draft.faq.items];
                    items[i] = { ...items[i], answer: v };
                    updateDraft("faq", { ...draft.faq, items });
                  }} />
                </div>
              )}
              onAdd={() => updateDraft("faq", { ...draft.faq, items: [...draft.faq.items, { question: "", answer: "" }] })}
              onDelete={i => updateDraft("faq", { ...draft.faq, items: draft.faq.items.filter((_, idx) => idx !== i) })}
              onMove={(i, dir) => {
                const items = [...draft.faq.items];
                const j = i + dir;
                if (j < 0 || j >= items.length) return;
                [items[i], items[j]] = [items[j], items[i]];
                updateDraft("faq", { ...draft.faq, items });
              }}
            />
            <SaveButton onClick={save} disabled={isSaving} />
          </div>
        )}

        {/* === FORM INLINE === */}
        {activeSection === "section-form-inline" && (
          <div className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
            <SectionTitle>טופס מרכז</SectionTitle>
            <Field label="כותרת הטופס (מרכז הדף)" value={draft.forms.inlineTitle} onChange={v => updateDraft("forms", { ...draft.forms, inlineTitle: v })} />
            <Field label="אימייל לקבלת פניות" value={draft.forms.contactEmail} onChange={v => updateDraft("forms", { ...draft.forms, contactEmail: v })} />
            <Field label="טקסט כפתור שליחה" value={draft.forms.submitText} onChange={v => updateDraft("forms", { ...draft.forms, submitText: v })} />
            <Field label="הודעת הצלחה" value={draft.forms.successMessage} onChange={v => updateDraft("forms", { ...draft.forms, successMessage: v })} />
            <Field label="תווית שדה שם" value={draft.forms.fieldName} onChange={v => updateDraft("forms", { ...draft.forms, fieldName: v })} />
            <Field label="תווית שדה טלפון" value={draft.forms.fieldPhone} onChange={v => updateDraft("forms", { ...draft.forms, fieldPhone: v })} />
            <Field label="תווית שדה סוג שירות" value={draft.forms.fieldService} onChange={v => updateDraft("forms", { ...draft.forms, fieldService: v })} />
            <SubLabel>אפשרויות שירות</SubLabel>
            <ArrayEditor
              items={draft.forms.serviceOptions}
              renderItem={(item, i) => (
                <Field label="" value={item} onChange={v => {
                  const serviceOptions = [...draft.forms.serviceOptions];
                  serviceOptions[i] = v;
                  updateDraft("forms", { ...draft.forms, serviceOptions });
                }} />
              )}
              onAdd={() => updateDraft("forms", { ...draft.forms, serviceOptions: [...draft.forms.serviceOptions, ""] })}
              onDelete={i => updateDraft("forms", { ...draft.forms, serviceOptions: draft.forms.serviceOptions.filter((_, idx) => idx !== i) })}
              onMove={(i, dir) => {
                const serviceOptions = [...draft.forms.serviceOptions];
                const j = i + dir;
                if (j < 0 || j >= serviceOptions.length) return;
                [serviceOptions[i], serviceOptions[j]] = [serviceOptions[j], serviceOptions[i]];
                updateDraft("forms", { ...draft.forms, serviceOptions });
              }}
            />
            <SaveButton onClick={save} disabled={isSaving} />
          </div>
        )}

        {/* === FORM FOOTER === */}
        {activeSection === "section-form-footer" && (
          <div className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
            <SectionTitle>טופס תחתית</SectionTitle>
            <Field label="כותרת פוטר" value={draft.forms.footerTitle} onChange={v => updateDraft("forms", { ...draft.forms, footerTitle: v })} />
            <p className="text-xs text-slate-500 mt-1">
              שאר הגדרות הטופס נמצאות ב&quot;טופס מרכז&quot;
            </p>
            <SaveButton onClick={save} disabled={isSaving} />
          </div>
        )}

        {/* === CLINIC INFO === */}
        {activeSection === "section-clinicinfo" && (
          <div className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
            <SectionTitle>פרטי מרפאה</SectionTitle>
            <Field label="שם" value={draft.clinic.name} onChange={v => updateDraft("clinic", { ...draft.clinic, name: v })} />
            <Field label="סלוגן" value={draft.clinic.tagline} onChange={v => updateDraft("clinic", { ...draft.clinic, tagline: v })} />
            <Field label="טלפון" value={draft.clinic.phone} onChange={v => updateDraft("clinic", { ...draft.clinic, phone: v })} />
            <Field label="כתובת" value={draft.clinic.address} onChange={v => updateDraft("clinic", { ...draft.clinic, address: v })} />
            <Field label="אימייל" value={draft.clinic.email} onChange={v => updateDraft("clinic", { ...draft.clinic, email: v })} />

            <SubLabel>שעות פתיחה</SubLabel>
            <ArrayEditor
              items={draft.clinic.hours}
              renderItem={(item, i) => (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Field label="יום" value={item.day} onChange={v => {
                      const hours = [...draft.clinic.hours];
                      hours[i] = { ...hours[i], day: v };
                      updateDraft("clinic", { ...draft.clinic, hours });
                    }} />
                  </div>
                  <div className="flex-1">
                    <Field label="שעות" value={item.hours} onChange={v => {
                      const hours = [...draft.clinic.hours];
                      hours[i] = { ...hours[i], hours: v };
                      updateDraft("clinic", { ...draft.clinic, hours });
                    }} />
                  </div>
                </div>
              )}
              onAdd={() => updateDraft("clinic", { ...draft.clinic, hours: [...draft.clinic.hours, { day: "", hours: "" }] })}
              onDelete={i => updateDraft("clinic", { ...draft.clinic, hours: draft.clinic.hours.filter((_, idx) => idx !== i) })}
              onMove={(i, dir) => {
                const hours = [...draft.clinic.hours];
                const j = i + dir;
                if (j < 0 || j >= hours.length) return;
                [hours[i], hours[j]] = [hours[j], hours[i]];
                updateDraft("clinic", { ...draft.clinic, hours });
              }}
            />

            <SubLabel>רשתות חברתיות</SubLabel>
            <Field label="Facebook" value={draft.clinic.social.facebook} onChange={v => updateDraft("clinic", { ...draft.clinic, social: { ...draft.clinic.social, facebook: v } })} />
            <Field label="Instagram" value={draft.clinic.social.instagram} onChange={v => updateDraft("clinic", { ...draft.clinic, social: { ...draft.clinic.social, instagram: v } })} />
            <Field label="YouTube" value={draft.clinic.social.youtube} onChange={v => updateDraft("clinic", { ...draft.clinic, social: { ...draft.clinic.social, youtube: v } })} />
            <Field label="WhatsApp (מספר בלבד)" value={draft.clinic.social.whatsapp} onChange={v => updateDraft("clinic", { ...draft.clinic, social: { ...draft.clinic.social, whatsapp: v } })} />
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                קוד Facebook Pixel (מוכנס לתגית head)
              </label>
              <textarea
                rows={5}
                className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm font-mono bg-[#0F1923] text-slate-200"
                placeholder="הדבק כאן את קוד ה-Pixel המלא..."
                value={draft.meta?.facebookPixelCode ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, meta: { ...d.meta, facebookPixelCode: e.target.value } }))}
              />
            </div>
            <SaveButton onClick={save} disabled={isSaving} />
          </div>
        )}

        {/* === TYPOGRAPHY === */}
        {activeSection === "section-typography" && (
          <div className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
            <SectionTitle>גודל גופן</SectionTitle>

            {/* Hero heading size */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">כותרת ראשית (Hero)</label>
              <div className="flex gap-2">
                {(["sm", "md", "lg"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, typography: { ...d.typography, heroHeadingSize: s } }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                      (draft.typography?.heroHeadingSize ?? "lg") === s
                        ? "bg-primary text-white border-primary"
                        : "bg-transparent text-slate-300 border-slate-600 hover:border-primary"
                    }`}
                  >
                    {s === "sm" ? "קטן" : s === "md" ? "בינוני" : "גדול"}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">משפיע על כותרת ה-Hero בלבד</p>
            </div>

            {/* Section headings size */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">כותרות קטעים (כל הדף)</label>
              <div className="flex gap-2">
                {(["sm", "md", "lg"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, typography: { ...d.typography, sectionHeadingSize: s } }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                      (draft.typography?.sectionHeadingSize ?? "md") === s
                        ? "bg-primary text-white border-primary"
                        : "bg-transparent text-slate-300 border-slate-600 hover:border-primary"
                    }`}
                  >
                    {s === "sm" ? "קטן" : s === "md" ? "בינוני" : "גדול"}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">משפיע על כותרות כל הקטעים (שירות, אודות, המלצות וכו׳)</p>
            </div>

            <SaveButton onClick={save} disabled={isSaving} />
          </div>
        )}

      </main>

      {/* Crop modal */}
      {cropSrc && (
        <ImageEditorModal
          src={cropSrc}
          onConfirm={b64 => {
            cropCallback?.(b64);
            setCropSrc(null);
            setCropCallback(null);
          }}
          onCancel={() => {
            setCropSrc(null);
            setCropCallback(null);
          }}
        />
      )}

      {/* Rich text modal */}
      {rtValue !== null && (
        <RichTextModal
          value={rtValue}
          onConfirm={html => {
            rtCallback?.(html);
            setRtValue(null);
            setRtCallback(null);
          }}
          onCancel={() => {
            setRtValue(null);
            setRtCallback(null);
          }}
        />
      )}

      {/* Dirty banner */}
      {isDirty && (
        <div className="fixed bottom-0 inset-x-0 z-40 flex items-center justify-between bg-amber-500/95 backdrop-blur-sm text-white text-sm font-semibold px-6 py-3 shadow-xl">
          <span>יש שינויים שלא נשמרו</span>
          <button
            onClick={save}
            disabled={isSaving}
            className="px-4 py-1.5 bg-white text-amber-600 rounded-lg text-sm font-bold hover:bg-amber-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSaving && (
              <span className="w-3.5 h-3.5 border-2 border-amber-400/40 border-t-amber-600 rounded-full animate-spin" />
            )}
            שמור עכשיו
          </button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 text-white font-semibold px-5 py-2.5 rounded-lg shadow-xl z-50 text-sm flex items-center gap-2 ${toast.type === "error" ? "bg-red-600 shadow-red-900/40" : "bg-teal-600 shadow-teal-900/40"}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
