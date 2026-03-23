import type { Metadata, Viewport } from "next";
import "./globals.css";
import CursorDot from "@/app/components/CursorDot";
import { ContentProvider } from "@/app/lib/ContentContext";
import PixelScript from "@/app/components/PixelScript";
import FloatingButtons from "@/app/components/FloatingButtons";
import CookieBanner from "@/app/components/CookieBanner";

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
        <script src="https://cdn.userway.org/widget.js" data-account="TVuo1SzhHJ" data-position="3"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap"
          rel="stylesheet"
        />
        <noscript>
          <img height="1" width="1" style={{ display: "none" }} src="https://www.facebook.com/tr?id=1643957256644269&ev=PageView&noscript=1" alt="" />
        </noscript>
      </head>
      <body className="antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[9999] focus:bg-[#4ABFBF] focus:text-white focus:px-4 focus:py-2 focus:rounded">
          דלג לתוכן הראשי
        </a>
        <ContentProvider>
          <PixelScript />
          <main id="main-content">
            {children}
          </main>
        </ContentProvider>
        <CursorDot />
        <FloatingButtons />
        <CookieBanner />
      </body>
    </html>
  );
}
