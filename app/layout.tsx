import type { Metadata } from "next";
import { Agdasima, Barlow_Condensed , Barlow} from "next/font/google";
import "./globals.css";

const agdasima = Agdasima({
  subsets: ["latin"],
  weight: ["400", "700"], // Regular + Bold
  variable: "--font-agdasima",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "700"], // Regular + Bold
  variable: "--font-barlow-condensed",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "700"], // Regular + Bold
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dental Surf Contest 2026",
  description: "Dental Surf Contest 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${agdasima.variable} ${barlowCondensed.variable} ${barlow.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
