import { forwardRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import type { SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> {
  options?: SelectOption[];
  className?: string;
  selectClassName?: string;
  variant?: "md" | "sm";
}

const SIZE_CLASSES: Record<NonNullable<SelectProps["variant"]>, string> = {
  md: "rounded-xl px-4 py-2.5 pr-10 text-sm",
  sm: "rounded-lg px-3 py-1.5 pr-8 text-xs",
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      children,
      className = "",
      selectClassName = "",
      variant = "md",
      ...rest
    },
    ref
  ) => (
    <div className={`relative inline-flex w-full ${className}`}>
      <select
        ref={ref}
        {...rest}
        className={`w-full cursor-pointer appearance-none border border-brand-200 bg-brand-50/60 font-semibold text-brand-700 outline-none transition-colors hover:border-brand-300 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60 ${SIZE_CLASSES[variant]} ${selectClassName}`}
      >
        {options
          ? options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))
          : children}
      </select>
      <FaChevronDown
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-brand ${
          variant === "sm" ? "right-2" : "right-3"
        }`}
        size={variant === "sm" ? 11 : 13}
      />
    </div>
  )
);

Select.displayName = "Select";

export default Select;
