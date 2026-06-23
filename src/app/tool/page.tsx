import { Index } from "../../views/Tool";
import { getMetadata } from "../../seo";

export const metadata = getMetadata("zh", "/tool");

export default function ToolPage() {
  return <Index />;
}
