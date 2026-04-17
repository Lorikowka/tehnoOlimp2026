import React from 'react';

interface ErrorBoundaryProps {
  componentName?: string;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    // Логирование ошибки
    // eslint-disable-next-line no-console
    console.error(`[ErrorBoundary] ${this.props.componentName || 'Component'} crashed:`, error, info.componentStack || info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="rounded-xl border border-red-500/30 bg-red-50/50 dark:bg-red-950/20 p-6 text-center">
          <div className="text-2xl mb-2">⚠️</div>
          <h3 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
            Компонент «{this.props.componentName || 'неизвестный'}» сломался
          </h3>
          <p className="text-xs text-red-600/80 dark:text-red-400/70 mb-3">
            Остальная часть приложения работает нормально.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      );
    }

    return this.props.children || null;
  }
}

// Default export to support both named and default imports
export default ErrorBoundary;
