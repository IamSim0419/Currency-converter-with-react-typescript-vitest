import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders currency converter title", () => {
  render(<App />);
  expect(screen.getByText("💱 Currency Converter")).toBeInTheDocument();
});
