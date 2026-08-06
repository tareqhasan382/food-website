import { Link, useLocation } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";
import AuthCard from "../components/auth/AuthCard";

interface EmailVerificationFailedState {
  message?: string;
}

const EmailVerificationFailedPage: React.FC = () => {
  const location = useLocation();
  const state = (location.state ?? {}) as EmailVerificationFailedState;
  const message =
    state.message ??
    "This verification link is invalid or has expired. Please request a new one.";

  return (
    <AuthCard
      title="Verification failed"
      subtitle="We couldn't verify your email address."
      footer={
        <Link to="/" className="font-semibold text-brand hover:underline">
          Back to home
        </Link>
      }
    >
      <div className="text-center">
        <FaExclamationCircle className="mx-auto h-14 w-14 text-red-500" />
      </div>
      <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-gray-700">
        <p className="font-semibold text-red-700">Link not recognized</p>
        <p className="mt-1">{message}</p>
      </div>
      <Link
        to="/login"
        className="btn-primary mt-4 inline-flex w-full justify-center"
      >
        Go to login
      </Link>
    </AuthCard>
  );
};

export default EmailVerificationFailedPage;
