import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "./page";

describe("LoginPage", () => {
  it("renders password-first UI and allows typing email & password", () => {
    render(<LoginPage />);
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "secret" } });
    expect(emailInput.value).toBe("user@example.com");
    expect(passwordInput.value).toBe("secret");
  // Updated heading copy after redesign
  expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });
});
