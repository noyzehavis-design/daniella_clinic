import type { Metadata, Viewport } from "next";
import "./globals.css";
import CursorDot from "@/app/components/CursorDot";
import { ContentProvider } from "@/app/lib/ContentContext";

export const metadata: Metadata = {
  title: 'ד"ר דניאלה בלטר-אבן | אורתודונטית מומחית – יישור שיניים שקוף בנהריה',
  description:
    'מרפאת אורתודונטיה של ד"ר דניאלה בלטר-אבן בנהריה. יישור שיניים שקוף לכל הגילאים, טכנולוגיית iTero, ייעוץ חינם. התקשרי עכשיו: 077-460-0800',
  openGraph: {
    title: 'ד"ר דניאלה בלטר-אבן | אורתודונטית מומחית – יישור שיניים שקוף בנהריה',
    description:
      'מרפאת אורתודונטיה של ד"ר דניאלה בלטר-אבן בנהריה. יישור שיניים שקוף לכל הגילאים, טכנולוגיית iTero, ייעוץ חינם. התקשרי עכשיו: 077-460-0800',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ContentProvider>
          {children}
        </ContentProvider>
        <CursorDot />
      </body>
    </html>
  );
}
