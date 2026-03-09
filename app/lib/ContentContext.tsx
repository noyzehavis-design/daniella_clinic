"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SiteContent, siteContent as defaultContent } from "./content";

type Ctx = { content: SiteContent; setContent: (c: SiteContent) => Promise<void> };
export const ContentContext = createContext<Ctx>({
  content: defaultContent,
  setContent: async () => {},
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    // Try localStorage first for instant load, then sync from KV
    try {
      const cached = localStorage.getItem("siteContent");
      if (cached) {
        const parsed = JSON.parse(cached);
        // Merge with defaults so missing keys don't crash
        setContentState({ ...defaultContent, ...parsed });
      }
    } catch {}

    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        const merged = { ...defaultContent, ...data };
        setContentState(merged);
        localStorage.setItem("siteContent", JSON.stringify(merged));
      })
      .catch(() => {});
  }, []);

  const setContent = async (c: SiteContent) => {
    setContentState(c);
    localStorage.setItem("siteContent", JSON.stringify(c));
    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(c),
    });
    const json = await res.json();
    if (!json.ok) {
      console.error("Save failed:", json);
    }
  };

  return (
    <ContentContext.Provider value={{ content, setContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
