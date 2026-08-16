import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";
import { login } from "../services/authService";
import { setCredentials } from "../redux/authSlice";
import { useAppDispatch } from "../redux/hooks";
import { isAdminRole } from "../types/auth";
import Spinner from "../components/ui/Spinner";
import PasswordInput from "../components/ui/PasswordInput";
import AuthCard from "../components/auth/AuthCard";

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>();

  const from = (location.state as { from?: string } | null)?.from;

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    setSubmitting(true);
    try {
      const { user, token } = await login(data);

      dispatch(setCredentials({ user, token }));
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      navigate(isAdminRole(user.role) ? "/dashboard" : from ?? "/");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Login failed. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (email: string, password: string): void => {
    setValue("email", email);
    setValue("password", password);
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to your Best Eats account."
      footer={
        <>
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-brand hover:underline"
          >
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              type="email"
              className="input py-2.5 pl-10"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
          </div>
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="label">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="mb-1 text-xs font-semibold text-brand hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            register={register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? <Spinner /> : "Log in"}
        </button>
      </form>

      <div className="mt-6 rounded-xl bg-gray-50 p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
          Demo accounts
        </p>
        <div className="flex flex-col gap-2 text-sm">
          <button
            onClick={() => fillDemo("admin@rbac.test", "secret123")}
            className="rounded-lg bg-white px-3 py-2 text-left ring-1 ring-gray-200 transition hover:ring-brand"
          >
            <span className="font-semibold text-gray-800">Admin</span> —{" "}
            <span className="text-gray-500">admin@rbac.test / secret123</span>
          </button>
          <button
            onClick={() => fillDemo("user@rbac.test", "secret123")}
            className="rounded-lg bg-white px-3 py-2 text-left ring-1 ring-gray-200 transition hover:ring-brand"
          >
            <span className="font-semibold text-gray-800">Customer</span> —{" "}
            <span className="text-gray-500">user@rbac.test / secret123</span>
          </button>
        </div>
      </div>
    </AuthCard>
  );
};

export default LoginPage;
