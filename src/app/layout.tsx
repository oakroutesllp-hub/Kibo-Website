import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

// Brand spec: "Primary typography direction: Montserrat... Bold/Semibold
// and Regular/Light weights." Montserrat is a variable font, so the full
// weight range is available via standard Tailwind utilities
// (font-light / font-normal / font-semibold / font-bold).
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KIBO",
  description: "KIBO — B2B men's apparel merchant exporter from India.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
