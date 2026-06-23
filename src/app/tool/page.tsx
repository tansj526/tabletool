import { Index } from "../../views/Tool";
import { DEFAULT_LANGUAGE } from "../../locales/locales";
import { getMetadata } from "../../seo";

export const metadata = getMetadata(DEFAULT_LANGUAGE, "/tool");

export default function ToolPage() {
  return <Index />;
}
