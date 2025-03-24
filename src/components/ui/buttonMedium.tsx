import React from "react";

interface ButtonMediumProps {
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

export const ButtonMedium: React.FC<ButtonMediumProps> = ({
                                                              type = "button",
                                                              onClick,
                                                              children,
                                                              className = "",
                                                              disabled = false,
                                                          }) => {
    return (
        <button
            type={type as "submit" | "reset" | "button"}
            onClick={onClick}
            disabled={disabled}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded-md w-full transition duration-300 ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
            } ${className}`}
        >
            {children}
        </button>
    );
};
