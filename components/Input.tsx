import classNames from "classnames";
import { FC, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

const Input: FC<InputProps> = ({ label, name, ...props }) => {
  return (
    <>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          type="text"
          name={name}
          id={name}
          className={classNames(
            "shadow-sm block w-full sm:text-sm rounded-md",
            props.readOnly
              ? "bg-gray-300 border-none focus:ring-0"
              : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          )}
          autoComplete={name}
          {...props}
        />
      </div>
    </>
  );
};

export default Input;
