import classNames from "classnames";
import { FC, HTMLAttributes } from "react";

const Badge: FC<HTMLAttributes<HTMLSpanElement>> = ({
  className,
  children,
}) => {
  return (
    <span
      className={classNames(
        "inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium",
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
