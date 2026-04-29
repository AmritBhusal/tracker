"use client";

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
        <h2 className="text-2xl font-bold text-stone-800 mb-3">
          Something went wrong
        </h2>
        <p className="text-stone-500 mb-6 max-w-md">
          {this.state.error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={() => {
            this.setState({ error: null });
            window.location.reload();
          }}
          className="px-6 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#E04A00] text-white font-semibold transition-colors cursor-pointer"
        >
          Reload Page
        </button>
      </div>
    );
  }
}
