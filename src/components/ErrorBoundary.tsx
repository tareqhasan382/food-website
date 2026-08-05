import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // In production, log to a monitoring service (e.g. Sentry).
    console.error("Unhandled UI error:", error, errorInfo);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleHome = (): void => {
    window.location.assign("/");
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-cream px-6">
          <div className="card max-w-md p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
              ⚠️
            </div>
            <h1 className="mb-2 font-display text-2xl font-bold text-gray-900">
              Something went wrong
            </h1>
            <p className="mb-6 text-sm text-gray-500">
              An unexpected error occurred while rendering this page. Please
              reload or go back home.
            </p>
            {this.state.message && (
              <p className="mb-6 rounded-lg bg-red-50 p-3 text-left text-xs text-red-700">
                {this.state.message}
              </p>
            )}
            <div className="flex justify-center gap-3">
              <button className="btn-primary" onClick={this.handleReload}>
                Reload page
              </button>
              <button className="btn-ghost" onClick={this.handleHome}>
                Go home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
