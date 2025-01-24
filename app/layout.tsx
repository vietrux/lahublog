import type { Metadata } from "next";
import NavBar from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "LaHu Blog",
  description: "A blog about life, beauty, and the pursuit of happiness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>LaHu Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900/95 via-pink-700/90 to-pink-900/90">
        <NavBar />
        <main className="flex-1 pt-20 pb-12"> {/* Add padding for fixed navbar */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
