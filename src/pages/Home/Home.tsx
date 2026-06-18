import { ShieldCheck, Timer, Wand2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Seo } from "../../components/common/Seo";
import { Tool } from "../Tool/Tool";

const BENEFITS = [
  { icon: Timer, title: "fastTitle", text: "fastText" },
  { icon: ShieldCheck, title: "safeTitle", text: "safeText" },
  { icon: Wand2, title: "simpleTitle", text: "simpleText" }
];

const FAQS = [
  ["faq1Q", "faq1A"],
  ["faq2Q", "faq2A"],
  ["faq3Q", "faq3A"],
  ["faq4Q", "faq4A"],
  ["faq5Q", "faq5A"]
];

export function Home() {
  const { t } = useTranslation();
  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(([question, answer]) => ({
      "@type": "Question",
      name: t(question),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(answer)
      }
    }))
  };

  return (
    <>
      <Seo
        title="表格工具箱 - 专业的表格数据转换工具"
        description={t("heroText")}
        keywords="表格转换,CSV转JSON,JSON转CSV,HTML表格转换,在线表格工具"
      />
      <Tool />
      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-950">{t("whyTitle")}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article
                  key={benefit.title}
                  className="rounded-md border border-slate-200 p-5"
                >
                  <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h3 className="mt-4 font-bold text-slate-950">{t(benefit.title)}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{t(benefit.text)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-950">{t("faqTitle")}</h2>
          <div className="mt-5 divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
            {FAQS.map(([question, answer]) => (
              <details key={question} className="group p-5">
                <summary className="cursor-pointer font-semibold text-slate-900">
                  {t(question)}
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">{t(answer)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }}
      />
    </>
  );
}
