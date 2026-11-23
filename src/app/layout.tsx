import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobworkOS | Manufacturing Operations",
  description: "Outsourced Manufacturing, Under Control.",
};

export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
