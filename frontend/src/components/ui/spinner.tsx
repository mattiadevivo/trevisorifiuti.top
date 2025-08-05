import { cva, VariantProps } from "class-variance-authority";
import { JSX, ParentComponent } from "solid-js";

const spinnerStyles = cva("loading loading-spinner grow max-w-8 max-h-8", {
  variants: {
    variant: {
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
      neutral: "text-neutral",
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
      error: "text-error",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export interface Props
  extends JSX.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerStyles> {}

export const Spinner: ParentComponent<Props> = (props) => {
  return (
    <div class="flex items-center justify-center h-lvh">
      <span
        class={spinnerStyles({
          variant: props.variant,
        })}
      />
    </div>
  );
};
