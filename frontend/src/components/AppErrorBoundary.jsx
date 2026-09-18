import React from 'react';

export default class AppErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <h1 className="text-xl font-bold text-red-900">This page could not be rendered</h1>
          <p className="mt-2 text-sm text-red-800">A frontend runtime error occurred in this dashboard.</p>
          <pre className="mt-4 overflow-auto rounded-xl bg-white p-4 text-left text-xs text-red-700">
            {this.state.error.message}
          </pre>
        </div>
      </div>
    );
  }
}
