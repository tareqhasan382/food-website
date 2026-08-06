import type { ReactNode } from "react";
import { FaStore } from "react-icons/fa";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  children,
  footer,
}) => (
  <section className="container-app flex justify-center py-14">
    <div className="card w-full max-w-md p-8">
      <div className="mb-6 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-2xl text-white">
          <FaStore />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold text-gray-900">
          {title}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      </div>
      {children}
      {footer && (
        <p className="mt-4 text-center text-sm text-gray-500">{footer}</p>
      )}
    </div>
  </section>
);

export default AuthCard;
