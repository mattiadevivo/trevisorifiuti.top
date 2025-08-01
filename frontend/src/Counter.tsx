import { Button } from "@ui/button";
import { Component, createSignal, onMount } from "solid-js";

export const Counter: Component = (props) => {
  const [count, setCount] = createSignal<number>(0);

  return (
    <>
      <h1 class="text-base">{count()}</h1>
      <Button
        intent="secondary"
        onClick={() => {
          setCount((previous) => previous + 1);
        }}
      >
        Increment
      </Button>
    </>
  );
};
