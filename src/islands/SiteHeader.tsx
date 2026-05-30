import PageRoot from "@/components/PageRoot";
import SiteHeader, { type SiteHeaderProps } from "@/components/SiteHeader";

export default function SiteHeaderIsland(props: SiteHeaderProps) {
  return (
    <PageRoot>
      <SiteHeader {...props} />
    </PageRoot>
  );
}
