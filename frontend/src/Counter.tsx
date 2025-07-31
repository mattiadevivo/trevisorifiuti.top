import { Button } from "@ui/Button";
import { Component, createSignal } from "solid-js";

export const Counter: Component = (props) => {
  const [count, setCount] = createSignal<number>(0);
  return (
    <>
      <h1 class="text-3xl text-blue-700 text-center py-20">{count()}</h1>
      <Button
        intent="primary"
        onClick={() => setCount((previous) => previous + 1)}
      >
        Increment
      </Button>
    </>
  );
};
