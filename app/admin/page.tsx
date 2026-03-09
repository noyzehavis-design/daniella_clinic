"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { SiteContent } from "@/app/lib/content";
import { useContent } from "@/app/lib/ContentContext";

// ─── Helper Components ────────────────────────────────────────────────────────

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-2.5">
      {label && <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>}
      <input
        className="w-full bg-[#0F1923] border border-slate-600/60 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400 transition-colors"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-2.5">
      <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
      <input type="file" accept="image/*" onChange={handleFile} className="text-xs text-slate-400 mb-1 block" />
      <p className="text-xs text-slate-500 mb-1">
        {hint ?? "עד 2MB · JPG / PNG / WebP"}
      </p>
      {value && (
        <div className="mt-2 flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" className="h-24 rounded-lg object-cover border border-slate-700 flex-shrink-0" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-700 hover:bg-red-500/80 text-slate-300 hover:text-white text-sm transition-colors"
            title="הסר תמונה"
          >
            ✕
          </button>
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

function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-5 px-5 py-2 bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold rounded-lg shadow-md shadow-teal-500/20 transition-all"
    >
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
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("adminAuth") === "true") setAuthenticated(true);
  }, []);

  useEffect(() => { setDraft(content); }, [content]);

  const showToast = () => {
    setToast("נשמר בהצלחה! ✓");
    setTimeout(() => setToast(""), 2500);
  };

  const save = async () => {
    await setContent(draft);
    showToast();
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
  }

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
          <Image src="/BLACK_LOGO.jpg" alt="לוגו" width={140} height={52} className="object-contain" />
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

  const sidebarSections = [
    { id: "section-hero", label: "כותרת ראשית" },
    { id: "section-trust", label: "פס אמון" },
    { id: "section-service", label: "שירות" },
    { id: "section-about", label: "על דניאלה" },
    { id: "section-patients", label: "מטופלים" },
    { id: "section-clinic", label: "המרפאה" },
    { id: "section-testimonials", label: "המלצות" },
    { id: "section-staff", label: "צוות" },
    { id: "section-videos", label: "סרטונים" },
    { id: "section-form", label: "טופס" },
    { id: "section-clinicinfo", label: "פרטי מרפאה" },
  ];

  return (
    <div dir="rtl" style={{ backgroundColor: "#0F1923", minHeight: "100vh" }} className="flex">

      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col w-60 shrink-0 border-l border-slate-700/60"
        style={{ backgroundColor: "#141E28", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}
      >
        <div className="p-5 border-b border-slate-700/60 flex flex-col items-center gap-3">
          <Image src="/BLACK_LOGO.jpg" alt="לוגו" width={110} height={42} className="object-contain" />
          <div className="w-full flex items-center justify-between">
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">מנהל</span>
            <button
              onClick={() => { sessionStorage.removeItem("adminAuth"); setAuthenticated(false); }}
              className="text-xs text-slate-400 hover:text-red-400 transition-colors"
            >
              התנתקות
            </button>
          </div>
        </div>
        <nav className="p-3 flex flex-col gap-0.5">
          {sidebarSections.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="group flex items-center gap-2 text-sm text-slate-400 hover:text-white py-2 px-3 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <span className="w-0.5 h-4 rounded-full bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              {s.label}
            </a>
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
        <div id="section-hero" className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
          <SectionTitle>כותרת ראשית (Hero)</SectionTitle>
          <Field label="כותרת" value={draft.hero.heading} onChange={v => updateDraft("hero", { ...draft.hero, heading: v })} />
          <Field label="תת-כותרת" value={draft.hero.subheading} onChange={v => updateDraft("hero", { ...draft.hero, subheading: v })} />
          <Field label="טקסט כפתור" value={draft.hero.ctaText} onChange={v => updateDraft("hero", { ...draft.hero, ctaText: v })} />
          <ImageUpload
            label="תמונת רקע"
            value={draft.hero.backgroundImage}
            onChange={v => updateDraft("hero", { ...draft.hero, backgroundImage: v })}
            hint="רוחב: 1920px · יחס 16:9 · עד 3MB · JPG/WebP"
          />
          <SaveButton onClick={save} />
        </div>

        {/* === TRUST BAR === */}
        <div id="section-trust" className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
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
          <SaveButton onClick={save} />
        </div>

        {/* === SERVICE === */}
        <div id="section-service" className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
          <SectionTitle>שירות</SectionTitle>
          <Field label="תג" value={draft.service.tag} onChange={v => updateDraft("service", { ...draft.service, tag: v })} />
          <Field label="כותרת" value={draft.service.heading} onChange={v => updateDraft("service", { ...draft.service, heading: v })} />
          <TextArea label="תיאור" value={draft.service.description} onChange={v => updateDraft("service", { ...draft.service, description: v })} />
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
          />
          <SaveButton onClick={save} />
        </div>

        {/* === ABOUT === */}
        <div id="section-about" className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
          <SectionTitle>על דניאלה</SectionTitle>
          <Field label="שם" value={draft.about.name} onChange={v => updateDraft("about", { ...draft.about, name: v })} />
          <Field label="תפקיד" value={draft.about.title} onChange={v => updateDraft("about", { ...draft.about, title: v })} />
          <TextArea label="ביוגרפיה" value={draft.about.bio} onChange={v => updateDraft("about", { ...draft.about, bio: v })} />
          <Field label="טקסט כפתור" value={draft.about.ctaText} onChange={v => updateDraft("about", { ...draft.about, ctaText: v })} />
          <ImageUpload
            label="תמונה"
            value={draft.about.image}
            onChange={v => updateDraft("about", { ...draft.about, image: v })}
            hint="פורטרט (3:4) · עד 1MB · JPG/PNG/WebP"
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
          <SaveButton onClick={save} />
        </div>

        {/* === PATIENTS === */}
        <div id="section-patients" className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
          <SectionTitle>תמונות מטופלים</SectionTitle>
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
          <SaveButton onClick={save} />
        </div>

        {/* === CLINIC SECTION === */}
        <div id="section-clinic" className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
          <SectionTitle>המרפאה</SectionTitle>
          <Field label="כותרת" value={draft.clinic_section.heading} onChange={v => updateDraft("clinic_section", { ...draft.clinic_section, heading: v })} />
          <Field label="תת-כותרת" value={draft.clinic_section.subheading} onChange={v => updateDraft("clinic_section", { ...draft.clinic_section, subheading: v })} />
          <Field label="טקסט כפתור" value={draft.clinic_section.ctaText} onChange={v => updateDraft("clinic_section", { ...draft.clinic_section, ctaText: v })} />

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
          <SaveButton onClick={save} />
        </div>

        {/* === TESTIMONIALS === */}
        <div id="section-testimonials" className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
          <SectionTitle>המלצות</SectionTitle>
          <ArrayEditor
            items={draft.testimonials.items}
            renderItem={(item, i) => (
              <div>
                <TextArea label="טקסט" value={item.text} onChange={v => {
                  const items = [...draft.testimonials.items];
                  items[i] = { ...items[i], text: v };
                  updateDraft("testimonials", { ...draft.testimonials, items });
                }} />
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
          <SaveButton onClick={save} />
        </div>

        {/* === STAFF SPLIT === */}
        <div id="section-staff" className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
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
          <SaveButton onClick={save} />
        </div>

        {/* === VIDEOS === */}
        <div id="section-videos" className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
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
          <SaveButton onClick={save} />
        </div>

        {/* === FOOTER FORM === */}
        <div id="section-form" className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
          <SectionTitle>טופס</SectionTitle>
          <Field label="כותרת טופס מוטמע" value={draft.forms.inlineTitle} onChange={v => updateDraft("forms", { ...draft.forms, inlineTitle: v })} />
          <Field label="כותרת פוטר" value={draft.forms.footerTitle} onChange={v => updateDraft("forms", { ...draft.forms, footerTitle: v })} />
          <Field label="טקסט כפתור שליחה" value={draft.forms.submitText} onChange={v => updateDraft("forms", { ...draft.forms, submitText: v })} />
          <Field label="הודעת הצלחה" value={draft.forms.successMessage} onChange={v => updateDraft("forms", { ...draft.forms, successMessage: v })} />
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
          <SaveButton onClick={save} />
        </div>

        {/* === CLINIC INFO === */}
        <div id="section-clinicinfo" className="mb-6 rounded-xl border border-slate-700/60 bg-[#141E28] p-6 shadow-sm">
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
          <SaveButton onClick={save} />
        </div>

      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-teal-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-xl shadow-teal-900/40 z-50 text-sm flex items-center gap-2">
          {toast}
        </div>
      )}
    </div>
  );
}
