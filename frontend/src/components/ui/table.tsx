import { cva, VariantProps } from "class-variance-authority";
import { JSX, ParentComponent, ParentProps } from "solid-js";

const tableStyles = cva("table", {
  variants: {},
  defaultVariants: {},
});

export interface Props
  extends ParentProps,
    JSX.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableStyles> {}

export const Table: ParentComponent<Props> = (props) => {
  return (
    <div class="overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow-xl">
      <table class={tableStyles()}>{props.children}</table>
    </div>
  );
};
