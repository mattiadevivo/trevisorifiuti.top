import { test, expect } from "vitest";
import { render } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { CounterPage } from "../src/app/routes/counter";

const user = userEvent.setup();

test("increments value", async () => {
  const { getByRole } = render(() => <CounterPage />);
  const button = getByRole("button");
  const counter = getByRole("heading");
  expect(counter).toHaveTextContent("0");
  await user.click(button);
  expect(counter).toHaveTextContent("1");
});
