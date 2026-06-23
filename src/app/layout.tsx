import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { ClientProviders } from "../components/providers/ClientProviders";
import { getMetadata } from "../seo";
import "../styles.css";

export const metadata: Metadata = getMetadata("zh");

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <ClientProviders>
          <AppLayout>{children}</AppLayout>
        </ClientProviders>
      </body>
    </html>
  );
}
