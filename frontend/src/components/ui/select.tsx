import { cva, VariantProps } from "class-variance-authority";
import { JSX, ParentComponent, ParentProps } from "solid-js";

const selectStyles = cva("select", {
  variants: {
    variant: {
      primary: "select-primary",
      secondary: "select-secondary",
      accent: "select-accent",
      info: "select-info",
      success: "select-success",
      warning: "select-warning",
      error: "select-error",
    },
    size: {
      xs: "select-xs",
      sm: "select-sm",
      md: "select-md",
      lg: "select-lg",
      xl: "select-xl",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "primary",
  },
});

export interface Props
  extends ParentProps,
    JSX.ButtonHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectStyles> {
  onChange: (value: any) => void;
}

export const Select: ParentComponent<Props> = (props) => {
  return (
    <select
      class={selectStyles({ variant: props.variant, size: props.size })}
      onChange={(e) => {
        console.log(e.currentTarget.value);
        props.onChange(e.currentTarget.value);
      }}
    >
      {props.children}
    </select>
  );
};
