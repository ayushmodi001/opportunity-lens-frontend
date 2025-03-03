import { Geist, Geist_Mono } from "next/font/google";
import {ThemeProvider} from '../providers/theme-provider';
import { dbConnect } from "@/lib/mongo";
import './globals.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Opportunity Lens",
  description: "Will Provide Later on",
};

export default async function RootLayout({ children }) {
  // const connection = await dbConnect();
  // console.log(connection)
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
