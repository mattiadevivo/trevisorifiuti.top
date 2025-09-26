import { cva, type VariantProps } from "class-variance-authority";
import type { JSX, ParentComponent, ParentProps } from "solid-js";

const selectStyles = cva("select", {
	variants: {
		intent: {
			none: "",
			primary: "select-primary",
			secondary: "select-secondary",
			accent: "select-accent",
			info: "select-info",
			success: "select-success",
			warning: "select-warning",
			error: "select-error",
		},
		sizeVariant: {
			xs: "select-xs",
			sm: "select-sm",
			md: "select-md",
			lg: "select-lg",
			xl: "select-xl",
		},
		width: {
			full: "w-full",
			min: "min-w",
		},
	},
	defaultVariants: {
		sizeVariant: "md",
		intent: "none",
		width: "min",
	},
});

export interface Props
	extends ParentProps,
		JSX.SelectHTMLAttributes<HTMLSelectElement>,
		VariantProps<typeof selectStyles> {
	onChange: (value: any) => void;
}

export const Select: ParentComponent<Props> = (props) => {
	return (
		<select
			id={props.id}
			class={selectStyles({
				intent: props.intent,
				sizeVariant: props.sizeVariant,
				width: props.width,
				class: props.class,
			})}
			required={props.required}
			value={props.value}
			onChange={(e) => {
				props.onChange(e.currentTarget.value);
			}}
		>
			{props.children}
		</select>
	);
};
