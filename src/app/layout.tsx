import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f9f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1411" },
  ],
};

export const metadata: Metadata = {
  title: "Mizan — Votre argent, en clair",
  description: "Mizan : suivez vos revenus, dépenses, budgets et objectifs d’épargne en toute simplicité.",
  applicationName: "Mizan",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Mizan",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/mizan-mark.svg",
    shortcut: "/mizan-mark.svg",
    apple: [{ url: "/mizan-mark.svg", sizes: "any", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fr"><body>{children}</body></html>;
}
