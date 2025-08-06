import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ leftIcon, rightIcon, className = "", ...props }, ref) => {
        return (
            <div className={"relative w-full"}>
                {leftIcon && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">{leftIcon}</span>
                )}
                <input
                    ref={ref}
                    className={
                        `w-full rounded-lg border border-gray-light px-4 py-2 text-base focus:outline-none disabled:bg-gray-100 disabled:text-gray-500` +
                        (leftIcon ? "pl-10 " : "") +
                        (rightIcon ? "pr-10 " : "") +
                        className
                    }
                    {...props}
                />
                {rightIcon && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">{rightIcon}</span>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input; 