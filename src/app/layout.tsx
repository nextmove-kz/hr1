import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
<<<<<<< HEAD
import { Toaster } from "@/components/ui/toaster";
=======
>>>>>>> 5287325 (search small changes)
import Sidebar from "@/components/Sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "HR1",
  description:
    "Инновационный проект позволяющий HR специалистам видетт широкую картину при поиске и отборе кандидатов.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
<<<<<<< HEAD
<<<<<<< HEAD
        {children}
=======
>>>>>>> 5287325 (search small changes)
=======
>>>>>>> 5287325 (search small changes)
        <div className="flex h-screen">
          <Sidebar />
          <main className="w-full h-full">{children}</main>
        </div>
<<<<<<< HEAD
<<<<<<< HEAD
        <Toaster />
=======
>>>>>>> 5287325 (search small changes)
=======
>>>>>>> 5287325 (search small changes)
      </body>
    </html>
  );
}
