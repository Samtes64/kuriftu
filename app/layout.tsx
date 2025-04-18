import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Wrapper, WrapperWithQuery } from "@/components/wrapper";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kuriftu Members",
  description: "Serving Our customers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <ThemeProvider attribute="class" defaultTheme="dark">
					<Wrapper>
         <Navbar/>
						<WrapperWithQuery>{children}</WrapperWithQuery>
					</Wrapper>
					<Toaster />
				</ThemeProvider>
      </body>
    </html>
  );
}
