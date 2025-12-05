import { cva, type VariantProps } from "class-variance-authority";
import type { JSX, ParentComponent, ParentProps } from "solid-js";

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
		shape: {
			circle: "btn-circle",
			square: "btn-square",
		},
		shadow: {
			lg: "shadow-lg hover:shadow-xl"
		}
	},
	defaultVariants: {
		size: "md",
		shape: "square",
	},
});

export interface Props
	extends ParentProps,
		JSX.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonStyles> {}

export const Button: ParentComponent<Props> = (props) => {
	const { intent, size, shape, shadow } = props;
	return (
		<button type="button" class={buttonStyles({ intent, size, shape })} {...props}>
			{props.children}
		</button>
	);
};
