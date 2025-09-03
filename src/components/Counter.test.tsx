import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Counter from "./Counter";

describe("Counter", () => {
  it("renderiza y permite incrementar", async () => {
    render(<Counter initial={1} />);
    expect(screen.getByText(/Contador:/)).toBeTruthy();
    const plus = screen.getByText("+");
    await userEvent.click(plus);
    expect(screen.getByText(/Contador: 2/)).toBeTruthy();
  });
});
