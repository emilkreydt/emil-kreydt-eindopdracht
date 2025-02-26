import React from "react";

interface ButtonMediumProps {
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
}

export const ButtonMedium: React.FC<ButtonMediumProps> = ({
                                                              type = "button",
                                                              onClick,
                                                              children,
                                                              className = "",
                                                          }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded-md w-full transition duration-300 ${className}`}
        >
            {children}
        </button>
    );
};
