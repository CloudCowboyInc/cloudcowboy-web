import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Optional label for which area failed (shown in the fallback). */
  area?: string;
}
interface State {
  error: Error | null;
}

/**
 * App-level error boundary. Without one, any runtime error unmounts the whole
 * React tree to a blank white screen (especially in production builds). This
 * catches the error and shows a recoverable fallback instead.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface to the console for diagnosis; never blank the screen.
    console.error("[ErrorBoundary]", this.props.area ?? "", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">
            {this.props.area ? `The ${this.props.area} hit an unexpected error.` : "An unexpected error occurred."}{" "}
            Reloading usually fixes it.
          </p>
          <pre className="max-h-32 w-full overflow-auto rounded-md border border-border/60 bg-card/60 p-3 text-left text-xs text-muted-foreground">
            {this.state.error.message}
          </pre>
          <button
            type="button"
            onClick={() => {
              this.setState({ error: null });
              window.location.reload();
            }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
