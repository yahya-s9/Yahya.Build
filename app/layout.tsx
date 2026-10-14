import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yahya's Bookshelf",
  description: "An illuminated manuscript archive.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Noto+Nastaliq+Urdu:wght@400;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-screen bg-background text-on-surface antialiased overflow-x-hidden selection:bg-secondary-fixed selection:text-secondary">
        {children}
      </body>
    </html>
  );
}
