import { Metadata } from "next";
import { Audiowide, Quicksand, Poiret_One } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { CircleCheckBig, CircleX } from "lucide-react";

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
  keywords: [
    "DJ Phat Tony",
    "Music Requests",
    "Song Requests",
    "Music Dashboard",
    "DJ Dashboard",
    "Music Management",
    "Live Music Requests",
    "DJ Tools",
    "Event DJ",
    "Party DJ",
    "Music Queue",
    "Music Playlist",
    "DJ Software",
    "Music Interaction",
    "Live DJ",
  ],
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
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
              padding: "16px",
              borderRadius: "8px",
            },
            success: {
              icon: <CircleCheckBig size={20} color="#10b981" />,
              style: {
                background: "#065f46",
                color: "#fff",
              },
            },
            error: {
              icon: <CircleX size={20} color="#ef4444" />,
              style: {
                background: "#991b1b",
                color: "#fff",
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
