import { useTranslation } from "react-i18next";
import { Seo } from "../../components/common/Seo";

export function About() {
  const { t } = useTranslation();

  return (
    <>
      <Seo
        title={t("aboutTitle")}
        description={t("aboutText")}
        keywords="tabletool,table converter,about"
      />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-950">{t("aboutTitle")}</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">{t("aboutText")}</p>
      </section>
    </>
  );
}
