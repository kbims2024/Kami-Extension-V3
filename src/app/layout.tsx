import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KAMI-EXTENSION",
  description: "Plateforme de réservation de lots",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
