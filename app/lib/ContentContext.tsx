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
      if (cached) setContentState(JSON.parse(cached));
    } catch {}

    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        setContentState(data);
        localStorage.setItem("siteContent", JSON.stringify(data));
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
      alert("שגיאה בשמירה: " + JSON.stringify(json));
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
