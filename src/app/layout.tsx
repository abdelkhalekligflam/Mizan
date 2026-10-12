import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Mizan — Votre argent, en clair", description: "Mizan : suivez vos revenus, dépenses, budgets et objectifs d’épargne en toute simplicité.", icons: { icon: "/mizan-mark.svg", shortcut: "/mizan-mark.svg", apple: "/mizan-mark.svg" }, applicationName: "Mizan" };
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="fr"><body>{children}</body></html>}
