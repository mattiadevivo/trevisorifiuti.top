import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const linkVariants = cva("inline-block", {
  variants: {
    variant: {
      default: "no-underline",
      active: "active font-bold",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type linkType = VariantProps<typeof linkVariants> & ComponentProps<"a">;

function HeaderLink({ href, variant, children, ...props }: linkType) {
  return (
    <a href={href} className={cn(linkVariants({ variant }))} {...props}>
      {children}
      <slot />
    </a>
  );
}

export { HeaderLink };
