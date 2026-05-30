import { forwardRef, type AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
  className?: string | ((props: { isActive: boolean }) => string);
  end?: boolean;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, to, end: _end, ...props }, ref) => {
    const path = typeof window !== "undefined" ? window.location.pathname : "";
    const isActive =
      to === "/" || to === ""
        ? path === "/"
        : path === to || path.startsWith(`${to.replace(/\/$/, "")}/`);

    const resolvedClass =
      typeof className === "function" ? className({ isActive }) : className;

    return (
      <a ref={ref} href={to} className={cn(resolvedClass)} data-active={isActive || undefined} {...props} />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
