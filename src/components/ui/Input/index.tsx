import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, prefix, suffix, containerClassName, ...props }, ref) => {
    const inputElement = (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          prefix && "pl-10",
          suffix && "pr-10",
          className
        )}
        {...props}
      />
    );

    if (!prefix && !suffix) {
      return inputElement;
    }

    return (
      <div className={cn("relative flex items-center w-full", containerClassName)}>
        {prefix && (
          <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
            {prefix}
          </div>
        )}
        {inputElement}
        {suffix && (
          <div className="absolute right-3 flex items-center text-muted-foreground">
            {suffix}
          </div>
        )}
      </div>
    );
  }
)
Input.displayName = "Input"

export { Input }
export default Input;