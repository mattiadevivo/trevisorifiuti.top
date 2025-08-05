import { cva, VariantProps } from "class-variance-authority";
import { JSX, ParentComponent, ParentProps } from "solid-js";

const buttonStyles = cva("btn", {
  variants: {
    intent: {
      primary: "btn-primary",
      secondary: "btn-secondary",
      danger: "btn-error",
    },
    size: {
      sm: "btn-sm",
      md: "btn-md",
      lg: "btn-lg",
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
