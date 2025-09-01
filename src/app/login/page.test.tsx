import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "./page";

describe("LoginPage", () => {
  it("renders form and allows typing email", () => {
    render(<LoginPage />);
    const input = screen.getByLabelText(/email/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "user@example.com" } });
    expect(input.value).toBe("user@example.com");
    expect(screen.getByRole("button", { name: /send magic link/i })).toBeInTheDocument();
  });
});
