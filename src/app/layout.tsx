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
        <script
            dangerouslySetInnerHTML={{
                __html:  `
            var _hmt = _hmt || [];
            (function() {
              var hm = document.createElement("script");
              hm.async=true;
              hm.src = "https://hm.baidu.com/hm.js?6a5c3dc0642059046375c36a9742b839";
              var s = document.getElementsByTagName("script")[0];
              s.parentNode.insertBefore(hm, s);
            })();
            `,
            }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=GTM-W98F59QD"></script>
        <script
            dangerouslySetInnerHTML={{
                __html:  `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GTM-W98F59QD');
            `,
            }}
        />
      </body>
    </html>
  );
}
