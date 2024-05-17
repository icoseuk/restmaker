import { expect, test } from "vitest";
import { sayHello } from "../src/index";

test("showing a greeting message", () => {
  expect(sayHello("World")).toBe("Hello World");
});
