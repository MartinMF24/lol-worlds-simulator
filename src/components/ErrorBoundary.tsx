'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught client exception:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-zinc-950 text-zinc-100 rounded-xl border border-rose-900/30">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
          </div>
          <h2 className="text-base font-bold text-white mb-1.5">
            Se ha producido un error inesperado
          </h2>
          <p className="text-xs text-zinc-400 max-w-md mb-6 leading-relaxed">
            {this.props.fallbackMessage ||
              'El simulador detectó un estado irregular. Puedes reiniciar el torneo de forma segura para continuar simulando.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-750 text-xs font-semibold transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Restablecer y Continuar</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
