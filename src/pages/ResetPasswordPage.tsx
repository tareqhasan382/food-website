import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { resetPassword } from "../services/authService";
import Spinner from "../components/ui/Spinner";
import PasswordInput from "../components/ui/PasswordInput";
import AuthCard from "../components/auth/AuthCard";

interface ResetPasswordForm {
  password: string;
  confirm: string;
}

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ResetPasswordForm>();

  const onSubmit: SubmitHandler<ResetPasswordForm> = async (data) => {
    if (!token) return;
    setSubmitting(true);
    try {
      await resetPassword(token, data.password);
      navigate("/password-reset-success", { replace: true });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Password reset failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <AuthCard
        title="Invalid reset link"
        subtitle="This link is missing its reset token."
        footer={
          <Link
            to="/forgot-password"
            className="font-semibold text-brand hover:underline"
          >
            Request a new link
          </Link>
        }
      >
        <div className="rounded-xl bg-red-50 p-4 text-sm text-gray-700">
          <p className="font-semibold text-red-700">Link not recognized</p>
          <p className="mt-1">
            Open the reset link from your email, or request a new one below.
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Choose a new password"
      subtitle="Your new password must be at least 6 characters."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <PasswordInput
          id="password"
          label="New password"
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
          label="Confirm new password"
          placeholder="Repeat password"
          autoComplete="new-password"
          error={errors.confirm?.message}
          register={register("confirm", {
            required: "Please confirm your password",
            validate: (value) =>
              value === getValues("password") || "Passwords do not match",
          })}
        />

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? <Spinner /> : "Reset password"}
        </button>
      </form>
    </AuthCard>
  );
};

export default ResetPasswordPage;
