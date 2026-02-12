
import type { Metadata } from "next";
import { Parisienne, Poppins } from "next/font/google";
import "./globals.css";

const parisienne = Parisienne({
  variable: "--font-parisienne",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Forever Us - A Love Story",
  description: "A collection of memories and surprises for my love.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${parisienne.variable} ${poppins.variable} antialiased bg-[#FFF5F7] text-[#2D1B1F]`}
      >
        {children}
      </body>
    </html>
  );
}
