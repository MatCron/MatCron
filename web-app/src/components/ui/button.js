import React from "react";
import { cn } from "../../lib/utils";

export function Button({ className, variant = "default", size = "default", children, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        
        // Variants
        variant === "default" && "bg-blue-600 text-white hover:bg-blue-700",
        variant === "destructive" && "bg-red-500 text-white hover:bg-red-600",
        variant === "outline" && "border border-slate-200 hover:bg-slate-100",
        variant === "ghost" && "hover:bg-slate-100",
        variant === "link" && "text-blue-600 underline-offset-4 hover:underline",
        
        // Sizes
        size === "default" && "h-10 px-4 py-2",
        size === "sm" && "h-8 px-3 text-sm",
        size === "lg" && "h-12 px-6 text-lg",
        
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
} 