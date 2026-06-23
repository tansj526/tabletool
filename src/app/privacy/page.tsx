import { Index } from "../../views/Privacy";
import { getMetadata } from "../../seo";

export const metadata = getMetadata("zh", "/privacy");

export default function PrivacyPage() {
  return <Index />;
}
