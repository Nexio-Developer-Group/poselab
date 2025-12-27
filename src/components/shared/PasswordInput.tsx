import { useState, forwardRef, MouseEvent } from "react";
import { Input } from "@/components/ui/Input";
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";

interface PasswordInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  onVisibleChange?: (visible: boolean) => void;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ value, onChange, placeholder, onVisibleChange }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = (e: MouseEvent<HTMLSpanElement>) => {
      e.preventDefault();
      setIsVisible((prev) => {
        const next = !prev;
        onVisibleChange?.(next);
        return next;
      });
    };

    return (
      <Input
        ref={ref}
        className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-gray-100 placeholder:text-gray-300/60 transition-all font-medium pr-10"
        type={isVisible ? "text" : "password"}
        value={value}
        placeholder={placeholder}
        suffix={
          <span
            className="cursor-pointer select-none text-xl"
            onClick={toggleVisibility}
          >
            {isVisible ? <HiOutlineEye /> : <HiOutlineEyeOff />}
          </span>
        }
        onChange={(e) => onChange?.(e.target.value)}
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
