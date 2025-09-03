import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";

describe("Home page", () => {
  it("muestra secciones Básicos y Avanzado", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText("Básicos")).toBeTruthy();
    expect(screen.getByText("Avanzado")).toBeTruthy();
  });
});
