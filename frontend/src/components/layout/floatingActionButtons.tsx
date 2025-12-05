import type { JSX, ParentComponent, ParentProps } from "solid-js";


export interface Props extends ParentProps {
    buttonContent: JSX.Element | string
}

export const FloatingActionButtons: ParentComponent<Props> = (props) => {
    return (
        <div class="fab">
  <div tabIndex={0} role="button" class="btn btn-lg btn-circle btn-primary">{props.buttonContent}</div>
  {props.children}
</div>
    );
};
