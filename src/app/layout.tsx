import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VibeContracts - AI Contract Generator & E-Signature Platform",
  description: "Create professional contracts in minutes with AI-powered clause suggestions and legally binding e-signatures. Built for freelancers and small businesses.",
  keywords: ["contract generator", "e-signature", "AI contracts", "legal documents", "freelance contracts"],
  openGraph: {
    title: "VibeContracts - AI Contract Generator & E-Signature",
    description: "Create professional contracts in minutes with AI-powered clause suggestions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
