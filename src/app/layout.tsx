import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { ClientProviders } from "../components/providers/ClientProviders";
import { getMetadata, getSeo } from "../seo";
import { DEFAULT_LANGUAGE } from "../locales/locales";
import "../styles.css";

const defaultSeo = getSeo(DEFAULT_LANGUAGE);

export const metadata: Metadata = getMetadata(DEFAULT_LANGUAGE);

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={defaultSeo.htmlLang}>
      <body>
        <ClientProviders>
          <AppLayout>{children}</AppLayout>
        </ClientProviders>
      </body>
    </html>
  );
}
