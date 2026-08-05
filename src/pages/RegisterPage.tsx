import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { FaEnvelope, FaLock, FaStore, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import { register as registerUser } from "../services/authService";
import { createSessionToken } from "../utils/session";
import { setCredentials } from "../redux/authSlice";
import { useAppDispatch } from "../redux/hooks";
import Spinner from "../components/ui/Spinner";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterForm>();

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    setSubmitting(true);
    try {
      const user = await registerUser(data);
      const token = createSessionToken(user);
      dispatch(setCredentials({ user, token }));
      toast.success(`Welcome to Best Eats, ${user.name.split(" ")[0]}!`);
      navigate("/");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Registration failed. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container-app flex justify-center py-14">
      <div className="card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-2xl text-white">
            <FaStore />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-gray-900">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Join Best Eats and order your favourites in minutes.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="label">
              Full name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="name"
                className="input pl-10"
                placeholder="John Doe"
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Name is too short" },
                })}
              />
            </div>
            {errors.name && (
              <p className="field-error">{errors.name.message}</p>
            )}
          </div>

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
                placeholder="Minimum 6 characters"
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

          <div>
            <label htmlFor="confirm" className="label">
              Confirm password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="confirm"
                type="password"
                className="input pl-10"
                placeholder="Repeat password"
                {...register("confirm", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === getValues("password") ||
                    "Passwords do not match",
                })}
              />
            </div>
            {errors.confirm && (
              <p className="field-error">{errors.confirm.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting ? <Spinner /> : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
