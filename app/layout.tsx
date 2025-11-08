import "./globals.css";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FieldFlow | Contractor Agent Workspace",
  description:
    "Unified workspace for plumbing contractors to manage workforce attendance, payments, and AI-driven coordination."
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
