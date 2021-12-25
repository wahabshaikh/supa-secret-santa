import classNames from "classnames";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "pending";
}

const Badge = ({ children, variant, className, ...props }: BadgeProps) => {
  return (
    <span
      className={classNames(
        "inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium",
        variant === "pending"
          ? "bg-red-100 text-red-800"
          : "bg-green-100 text-green-800",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
