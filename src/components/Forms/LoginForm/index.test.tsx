import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "./index";

describe("LoginForm", () => {
  const defaultProps = {
    values: { email: "", password: "" },
    errors: { email: "", password: "" },
    touched: { email: false, password: false },
    handleChange: jest.fn(),
    handleBlur: jest.fn(),
    handleSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders email and password fields", () => {
    render(<LoginForm {...defaultProps} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("calls handleChange and handleBlur on input interaction", () => {
    render(<LoginForm {...defaultProps} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.blur(emailInput);
    fireEvent.change(passwordInput, { target: { value: "secret123" } });
    fireEvent.blur(passwordInput);

    expect(defaultProps.handleChange).toHaveBeenCalledTimes(2);
    expect(defaultProps.handleBlur).toHaveBeenCalledTimes(2);
  });

  it("displays validation errors when touched and errors are present", () => {
    const props = {
      ...defaultProps,
      errors: {
        email: "Invalid email address",
        password: "Required",
      },
      touched: {
        email: true,
        password: true,
      },
    };

    render(<LoginForm {...props} />);

    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

});
