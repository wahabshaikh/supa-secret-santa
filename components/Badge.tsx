import classNames from "classnames";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {}

const Badge = ({ children, className, ...props }: BadgeProps) => {
  return (
    <span
      className={classNames(
        "inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
