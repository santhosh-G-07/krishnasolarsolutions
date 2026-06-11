import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="fatal-fallback">
        <section>
          <img src="/assets/kss-logo.jpeg" alt="KSS" />
          <span className="eyebrow">Something went wrong</span>
          <h1>This page could not load correctly.</h1>
          <p>Your data is safe. Reload the page to try again, or return to the website.</p>
          <div className="action-row">
            <button className="button primary" onClick={() => window.location.reload()}>Reload page</button>
            <a className="button secondary" href="/">Back to website</a>
          </div>
        </section>
      </main>
    );
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
