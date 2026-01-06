import React from "react";
import { RefreshCcw } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("UI Error:", error);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 max-w-sm text-center border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-red-100 text-red-600 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Oops! Something went wrong
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                An unexpected error occurred. Please try refreshing the page.
              </p>

              <button
                onClick={this.handleRetry}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
              >
                <RefreshCcw className="h-4 w-4" />
                Retry
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
