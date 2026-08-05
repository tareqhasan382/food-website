import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { FaEnvelope, FaLock, FaStore } from "react-icons/fa";
import { toast } from "react-toastify";
import { login } from "../services/authService";
import { createSessionToken } from "../utils/session";
import { setCredentials } from "../redux/authSlice";
import { useAppDispatch } from "../redux/hooks";
import Spinner from "../components/ui/Spinner";

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
      const user = await login(data);
      const token = createSessionToken(user);
      dispatch(setCredentials({ user, token }));
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      navigate(user.role === "admin" ? "/dashboard" : from ?? "/");
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
    <section className="container-app flex justify-center py-14">
      <div className="card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-2xl text-white">
            <FaStore />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-gray-900">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Log in to your Best Eats account.
          </p>
        </div>

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
                className="input pl-10"
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
            {errors.email && (
              <p className="field-error">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                type="password"
                className="input pl-10"
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
            </div>
            {errors.password && (
              <p className="field-error">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting ? <Spinner /> : "Log in"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-brand hover:underline">
            Sign up
          </Link>
        </p>

        {/* Demo credentials */}
        <div className="mt-6 rounded-xl bg-gray-50 p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
            Demo accounts
          </p>
          <div className="flex flex-col gap-2 text-sm">
            <button
              onClick={() => fillDemo("admin@besteats.com", "admin123")}
              className="rounded-lg bg-white px-3 py-2 text-left ring-1 ring-gray-200 transition hover:ring-brand"
            >
              <span className="font-semibold text-gray-800">Admin</span> —{" "}
              <span className="text-gray-500">admin@besteats.com / admin123</span>
            </button>
            <button
              onClick={() => fillDemo("user@besteats.com", "user123")}
              className="rounded-lg bg-white px-3 py-2 text-left ring-1 ring-gray-200 transition hover:ring-brand"
            >
              <span className="font-semibold text-gray-800">Customer</span> —{" "}
              <span className="text-gray-500">user@besteats.com / user123</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
