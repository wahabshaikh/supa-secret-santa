import { FC } from "react";

const Card: FC = ({ children }) => {
  return (
    <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
      {children}
    </div>
  );
};

export default Card;
