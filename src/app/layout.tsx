import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Mizan — Votre argent, en clair", description: "Un suivi simple et élégant de vos finances personnelles." };
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="fr"><body>{children}</body></html>}
