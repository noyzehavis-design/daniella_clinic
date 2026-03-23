"use client";
import { useState, useEffect } from "react";

type Prefs = {
  largeText: boolean;
  highContrast: boolean;
  highlightLinks: boolean;
  reduceMotion: boolean;
};

const defaultPrefs: Prefs = {
  largeText: false,
  highContrast: false,
  highlightLinks: false,
  reduceMotion: false,
};

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("a11y-prefs");
      if (stored) setPrefs(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("text-lg-a11y", prefs.largeText);
    html.classList.toggle("high-contrast", prefs.highContrast);
    html.classList.toggle("highlight-links", prefs.highlightLinks);
    html.classList.toggle("reduce-motion", prefs.reduceMotion);
    try { localStorage.setItem("a11y-prefs", JSON.stringify(prefs)); } catch {}
  }, [prefs]);

  const toggle = (key: keyof Prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const options: { key: keyof Prefs; label: string }[] = [
    { key: "largeText", label: "הגדל טקסט" },
    { key: "highContrast", label: "ניגודיות גבוהה" },
    { key: "highlightLinks", label: "הדגש קישורים" },
    { key: "reduceMotion", label: "עצור אנימציות" },
  ];

  return (
    <div className="fixed bottom-24 left-6 z-[9998]" dir="rtl">
      {open && (
        <div
          className="absolute bottom-16 left-0 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 w-52"
          role="dialog"
          aria-label="הגדרות נגישות"
        >
          <p className="font-bold text-sm text-[#0F1923] mb-3">הגדרות נגישות</p>
          <ul className="flex flex-col gap-2">
            {options.map(({ key, label }) => (
              <li key={key}>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-[#0F1923]">
                  <input
                    type="checkbox"
                    checked={prefs[key]}
                    onChange={() => toggle(key)}
                    className="w-4 h-4 accent-[#4ABFBF]"
                  />
                  {label}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="פתח תפריט נגישות"
        aria-expanded={open}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl"
        style={{ background: "#4ABFBF", boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}
      >
        ♿
      </button>
    </div>
  );
}
