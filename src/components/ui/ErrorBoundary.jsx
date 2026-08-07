import { Component } from 'react';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';

const MAX_RETRIES = 3;

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`ErrorBoundary caught at ${window.location.pathname}:`, error, errorInfo);
  }

  handleReset = () => {
    const nextRetry = this.state.retryCount + 1;
    if (nextRetry > MAX_RETRIES) {
      console.warn('[ErrorBoundary] Max retries reached, redirecting to home');
      window.location.href = '/';
      return;
    }
    this.setState({ hasError: false, error: null, retryCount: nextRetry });
  };

  handleRefreshPage = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const canRetry = this.state.retryCount < MAX_RETRIES;

      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-ink mb-2">We couldn&apos;t load this page</h2>
          <p className="text-ink-muted text-sm mb-6 max-w-sm">
            Something interrupted the request. Your saved data has not been affected. Try loading the content again or return to the home page.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {canRetry && (
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                Try Again
              </button>
            )}
            <button
              onClick={this.handleRefreshPage}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-ink/10 text-ink rounded-xl font-medium text-sm hover:bg-surface transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh Page
            </button>
            <button
              onClick={this.handleGoHome}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-ink/10 text-ink rounded-xl font-medium text-sm hover:bg-surface transition-colors"
            >
              <Home className="w-4 h-4" />
              Go to Home
            </button>
          </div>
          {!canRetry && (
            <p className="mt-4 text-xs text-ink-muted">
              Max retries reached. Please refresh the page or go to the home page.
            </p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
