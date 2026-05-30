import PageRoot from "@/components/PageRoot";
import SiteFooter, { type SiteFooterProps } from "@/components/SiteFooter";

export default function SiteFooterIsland(props: SiteFooterProps) {
  return (
    <PageRoot>
      <SiteFooter {...props} />
    </PageRoot>
  );
}
