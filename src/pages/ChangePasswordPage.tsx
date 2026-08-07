import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { changePassword } from "../services/authService";
import { useAppSelector } from "../redux/hooks";
import Spinner from "../components/ui/Spinner";
import PasswordInput from "../components/ui/PasswordInput";
import AuthCard from "../components/auth/AuthCard";

interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirm: string;
}

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ChangePasswordForm>();

  const onSubmit: SubmitHandler<ChangePasswordForm> = async (data) => {
    setSubmitting(true);
    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully.");
      navigate("/");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Password change failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Change password"
      subtitle={user ? `Updating the password for ${user.email}.` : "Update your password."}
      footer={
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="font-semibold text-brand hover:underline"
        >
          Go back
        </button>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <PasswordInput
          id="oldPassword"
          label="Current password"
          placeholder="Your current password"
          autoComplete="current-password"
          error={errors.oldPassword?.message}
          register={register("oldPassword", {
            required: "Current password is required",
          })}
        />

        <PasswordInput
          id="newPassword"
          label="New password"
          placeholder="Minimum 6 characters"
          autoComplete="new-password"
          error={errors.newPassword?.message}
          register={register("newPassword", {
            required: "New password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />

        <PasswordInput
          id="confirm"
          label="Confirm new password"
          placeholder="Repeat new password"
          autoComplete="new-password"
          error={errors.confirm?.message}
          register={register("confirm", {
            required: "Please confirm your password",
            validate: (value) =>
              value === getValues("newPassword") || "Passwords do not match",
          })}
        />

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? <Spinner /> : "Update password"}
        </button>
      </form>
    </AuthCard>
  );
};

export default ChangePasswordPage;
