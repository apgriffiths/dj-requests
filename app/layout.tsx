import type { Metadata } from "next";
import { Audiowide, Quicksand, Poiret_One } from "next/font/google";
import "./globals.css";

const audioWide = Audiowide({
  variable: "--font-audiowide",
  subsets: ["latin"],
  weight: "400",
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});
const poiretOne = Poiret_One({
  variable: "--font-poiret-one",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "DJ Phat Tony",
  description: "Requests for DJ Phat Tony",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${audioWide.variable} ${quicksand.variable} ${poiretOne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
