import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
}

const Button = ({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={classNames(
        "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2",
        variant === "primary" &&
          "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        variant === "secondary" &&
          "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
        variant === "tertiary" &&
          "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-green-500",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
