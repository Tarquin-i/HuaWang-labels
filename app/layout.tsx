import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ProductProvider } from "@/lib/product-context";

export const metadata: Metadata = {
  title: "华旺标签",
  description: "华旺标签",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <ProductProvider>
          {children}
          <Toaster />
        </ProductProvider>
      </body>
    </html>
  );
}
