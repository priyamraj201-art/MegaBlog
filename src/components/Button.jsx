import React from "react";

export default function Button({
    children,
    type = "button",
    bgColor = "bg-[#B5FF00]",
    textColor = "text-[#121212]",
    className = "",
    ...props
}) {
    return (
        <button type={type} className={`px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-sm hover:opacity-90 active:scale-95 ${bgColor} ${textColor} ${className}`} {...props}>
            {children}
        </button>
    );
}
