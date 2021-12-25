import classNames from "classnames";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={classNames(
        "bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
