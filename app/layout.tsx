import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { UserProvider } from "@/context/UserContext";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Team Ashoka Meme Reviews",
  description: "Virtual team bonding through tech memes — vote, laugh, repeat",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${inter.className} h-full flex flex-col bg-black text-[#f9fafb]`}>
        <UserProvider>
          <Navbar />
          <main className="flex-1 overflow-hidden">{children}</main>
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#111111",
                border: "1px solid #222222",
                color: "#f9fafb",
              },
            }}
          />
        </UserProvider>
      </body>
    </html>
  );
}
