import { cva, VariantProps } from "class-variance-authority";
import { Component, JSX, ParentComponent, ParentProps } from "solid-js";

const buttonStyles = cva("flex items-center justify-center rounded-md", {
  variants: {
    intent: {
      primary: "bg-primary hover:bg-primary-hover text-white",
      secondary: "bg-gray-500 text-white",
      danger: "bg-red-500 text-white",
    },
    size: {
      sm: "px-2 py-1 text-sm",
      md: "px-4 py-2 text-md",
      lg: "px-6 py-3 text-lg",
    },
  },
  defaultVariants: {
    size: "md",
    intent: "primary",
  },
});

export interface Props
  extends ParentProps,
    JSX.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {}

export const Button: ParentComponent<Props> = (props) => {
  const { intent, size } = props;
  return (
    <button class={buttonStyles({ intent, size })} {...props}>
      {props.children}
    </button>
  );
};
