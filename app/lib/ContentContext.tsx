"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SiteContent, siteContent as defaultContent } from "./content";

type Ctx = { content: SiteContent; setContent: (c: SiteContent) => void };
export const ContentContext = createContext<Ctx>({
  content: defaultContent,
  setContent: () => {},
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("siteContent");
      if (raw) setContentState(JSON.parse(raw));
    } catch {}
  }, []);

  const setContent = (c: SiteContent) => {
    setContentState(c);
    localStorage.setItem("siteContent", JSON.stringify(c));
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
