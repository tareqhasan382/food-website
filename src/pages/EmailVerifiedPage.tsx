import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import AuthCard from "../components/auth/AuthCard";

const EmailVerifiedPage: React.FC = () => (
  <AuthCard
    title="Email verified"
    subtitle="Your email address has been confirmed."
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
      <p className="font-semibold text-green-800">Verification successful</p>
      <p className="mt-1">
        Your account is now active. You can log in and start ordering from Best
        Eats.
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

export default EmailVerifiedPage;
