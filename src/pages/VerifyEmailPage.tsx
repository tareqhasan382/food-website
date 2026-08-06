import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../services/authService";
import Spinner from "../components/ui/Spinner";
import AuthCard from "../components/auth/AuthCard";

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const run = async (): Promise<void> => {
      if (!token) {
        navigate("/email-verification-failed", {
          replace: true,
          state: { message: "This verification link is missing its token." },
        });
        return;
      }
      try {
        await verifyEmail(token);
        navigate("/email-verified", { replace: true });
      } catch (error) {
        navigate("/email-verification-failed", {
          replace: true,
          state: {
            message:
              error instanceof Error
                ? error.message
                : "Email verification failed.",
          },
        });
      }
    };

    void run();
  }, [token, navigate]);

  return (
    <AuthCard
      title="Verify your email"
      subtitle="Confirming your email address…"
    >
      <div className="flex justify-center py-6">
        <Spinner className="border-brand/30 border-t-brand" />
      </div>
    </AuthCard>
  );
};

export default VerifyEmailPage;
