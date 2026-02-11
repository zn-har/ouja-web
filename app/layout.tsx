import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ouija - Web Experience",
  description: "Ask the spirits your questions through this mystical Ouija board powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=EB+Garamond:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" style={{ fontFamily: "'EB Garamond', serif" }}>
        {children}
      </body>
    </html>
  );
}
