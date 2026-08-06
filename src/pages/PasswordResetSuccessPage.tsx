import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import AuthCard from "../components/auth/AuthCard";

const PasswordResetSuccessPage: React.FC = () => (
  <AuthCard
    title="Password reset"
    subtitle="Your password has been updated successfully."
    footer={
      <Link to="/" className="font-semibold text-brand hover:underline">
        Back to home
      </Link>
    }
  >
    <div className="text-center">
      <FaCheckCircle className="mx-auto h-14 w-14 text-green-500" />
    </div>
    <div className="mt-4 rounded-xl bg-green-50 p-4 text-sm text-gray-700">
      <p className="font-semibold text-green-800">All set</p>
      <p className="mt-1">
        You can now log in with your new password and continue ordering from
        Best Eats.
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

export default PasswordResetSuccessPage;
