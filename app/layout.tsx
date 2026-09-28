import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { AgencyProvider } from "@/lib/agency-store";
import { TooltipProvider } from "@/components/ui/tooltip";
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
  title: "Haoken — AI Marketing Agency",
  description:
    "Operations dashboard for clients, invoices, campaigns, leads, and Gemini-powered automation templates.",
};

const themeScript = `(function(){try{if(localStorage.getItem("theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <TooltipProvider>
          <AgencyProvider>{children}</AgencyProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
