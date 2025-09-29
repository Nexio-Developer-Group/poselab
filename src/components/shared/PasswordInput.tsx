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
        type={isVisible ? "text" : "password"}
        value={value}
        placeholder={placeholder}
        className="pr-10"
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
