import { Index } from "../../views/Privacy";
import { DEFAULT_LANGUAGE } from "../../locales/locales";
import { getMetadata } from "../../seo";

export const metadata = getMetadata(DEFAULT_LANGUAGE, "/privacy");

export default function PrivacyPage() {
  return <Index />;
}
