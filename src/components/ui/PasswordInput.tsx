import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

interface PasswordInputProps {
  id: string;
  label?: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  register: UseFormRegisterReturn;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label,
  placeholder,
  autoComplete = "current-password",
  error,
  register,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <div className="relative">
        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          className="input py-2.5 pl-10 pr-11"
          placeholder={placeholder}
          {...register}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 transition-colors hover:text-gray-600"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
};

export default PasswordInput;
