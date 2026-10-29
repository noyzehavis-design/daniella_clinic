import type { Metadata } from "next";

// Reached only after a lead is confirmed. Kept out of search results so the
// URL keeps meaning "a form was just sent" for the Meta custom conversion.
export const metadata: Metadata = {
  title: 'תודה | ד"ר דניאלה בלטר-אבן',
  robots: { index: false, follow: false },
};

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return children;
}
