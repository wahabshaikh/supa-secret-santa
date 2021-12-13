import { FC } from "react";

interface BadgeProps {
  colors: string;
}

const Badge: FC<BadgeProps> = ({ colors, children }) => {
  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${colors}`}
    >
      {children}
    </span>
  );
};

export default Badge;
