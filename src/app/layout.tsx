import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

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
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var origin = 'https://kami-extension-v3.vercel.app';
            var nativeFetch = window.fetch;
            window.fetch = function(resource, init) {
              var url = (typeof resource === 'string') ? resource : (resource.url || '');
              if (url.indexOf('/api/') === 0 || url === '/api') {
                var newResource = (typeof resource === 'string') ? (origin + resource) : resource;
                return nativeFetch(newResource, init);
              }
              return nativeFetch(resource, init);
            };
          })();
        `}} />
      </head>
      <body className="antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
