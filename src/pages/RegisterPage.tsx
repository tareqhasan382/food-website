import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { FaEnvelope, FaUser } from "react-icons/fa";
import toast from "react-hot-toast";
import { register as registerUser } from "../services/authService";
import Spinner from "../components/ui/Spinner";
import PasswordInput from "../components/ui/PasswordInput";
import AuthCard from "../components/auth/AuthCard";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

const RegisterPage: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterForm>();

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    setSubmitting(true);
    try {
      const user = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success("Account created! Please verify your email.");
      setRegisteredEmail(user.email);
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

  if (registeredEmail) {
    return (
      <AuthCard
        title="Check your email"
        subtitle="One last step before you can log in."
        footer={
          <Link
            to="/login"
            className="font-semibold text-brand hover:underline"
          >
            Back to login
          </Link>
        }
      >
        <div className="rounded-xl bg-brand-50 p-4 text-sm text-gray-700">
          <p className="font-semibold text-gray-800">Verification sent</p>
          <p className="mt-1">
            We emailed a verification link to{" "}
            <span className="font-semibold text-brand">{registeredEmail}</span>.
            Click it to verify your account, then log in.
          </p>
        </div>
        <Link
          to="/login"
          className="btn-primary mt-4 inline-flex w-full justify-center"
        >
          Go to login
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join Best Eats and order your favourites in minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="label">
            Full name
          </label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="name"
              className="input py-2.5 pl-10"
              placeholder="John Doe"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Name is too short" },
              })}
            />
          </div>
          {errors.name && <p className="field-error">{errors.name.message}</p>}
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

        <PasswordInput
          id="password"
          label="Password"
          placeholder="Minimum 6 characters"
          autoComplete="new-password"
          error={errors.password?.message}
          register={register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />

        <PasswordInput
          id="confirm"
          label="Confirm password"
          placeholder="Repeat password"
          autoComplete="new-password"
          error={errors.confirm?.message}
          register={register("confirm", {
            required: "Please confirm your password",
            validate: (value) =>
              value === getValues("password") || "Passwords do not match",
          })}
        />

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full"
        >
          {submitting ? <Spinner /> : "Create account"}
        </button>
      </form>
    </AuthCard>
  );
};

export default RegisterPage;
