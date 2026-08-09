import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 24,
            background: "#07070c",
            color: "#f2f3f8",
            fontFamily: "ui-sans-serif, sans-serif",
          }}
        >
          <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, color: "#75778c", margin: 0 }}>
            SOMETHING WENT WRONG
          </p>
          <p style={{ fontSize: 20, marginTop: 12 }}>This part of the journey hit a snag.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 20,
              padding: "12px 20px",
              background: "#5b7fff",
              color: "#05050f",
              border: "none",
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 500,
              width: "fit-content",
            }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
