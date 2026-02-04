import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Class Time Table - AIML 2-A",
  description:
    "A simple class timetable web app built by Rishav Roy. Organize your daily schedule easily.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    themeColor: "#121212",
    userScalable: true,
  },
  openGraph: {
    title: "Class Time Table - Rishav Roy",
    description:
      "A simple class timetable web app built by Rishav Roy. Organize your daily schedule easily.",
    url: "https://rishavroy-2006.github.io/Class-Time-Table/",
    images: [
      {
        url: "/preview-image.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Class Time Table - Rishav Roy",
    description:
      "A simple class timetable web app built by Rishav Roy. Organize your daily schedule easily.",
    images: ["/preview-image.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          httpEquiv="Cache-Control"
          content="no-cache, no-store, must-revalidate"
        />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
