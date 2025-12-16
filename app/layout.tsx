import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ReactQueryProvider } from "@/lib/react-querry-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <ReactQueryProvider>
          <Providers>{children}</Providers>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
