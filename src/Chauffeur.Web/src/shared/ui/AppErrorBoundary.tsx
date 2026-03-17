import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from 'react';
import { i18n } from '@/i18n';

interface State {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<PropsWithChildren<{ fallback?: ReactNode }>, State> {
  override state: State = {
    hasError: false,
  };

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    void error;
    void info;
    this.setState({ hasError: true });
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="app-fallback">
            <h1>{i18n.t('errorBoundary.title')}</h1>
            <p>{i18n.t('errorBoundary.description')}</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
