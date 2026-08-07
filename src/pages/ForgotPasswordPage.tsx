import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";
import { forgotPassword } from "../services/authService";
import Spinner from "../components/ui/Spinner";
import AuthCard from "../components/auth/AuthCard";

interface ForgotPasswordForm {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>();

  const onSubmit: SubmitHandler<ForgotPasswordForm> = async (data) => {
    setSubmitting(true);
    try {
      await forgotPassword(data.email);
      setSubmittedEmail(data.email);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedEmail) {
    return (
      <AuthCard
        title="Check your email"
        subtitle="If an account exists, a reset link is on its way."
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
          <p className="font-semibold text-gray-800">Reset link sent</p>
          <p className="mt-1">
            We emailed a password reset link to{" "}
            <span className="font-semibold text-brand">{submittedEmail}</span>.
            The link expires in 10 minutes.
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Log in
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

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? <Spinner /> : "Send reset link"}
        </button>
      </form>
    </AuthCard>
  );
};

export default ForgotPasswordPage;
