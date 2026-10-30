import type { Metadata } from "next";
import { Barlow_Condensed, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-barlow",
});

const sans = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "GitHub Roaster",
  description: "Enter a GitHub username. Get roasted.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
