import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  // Get login/signup functions from the auth context
  const { login, signup } = useAuth();

  // State for form inputs
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Which form to show: "login" or "signup"
  const [mode, setMode] = useState("login");

  // Error and loading states
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle login form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Can login with email OR username, so we'll try with email first if it looks like an email
      const result = await login(email || null, username || null, password);

      if (!result.success) {
        setError(result.message);
      }
      // If successful, useAuth will handle redirecting (user context is updated)
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup form submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength (optional)
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup(email, username, password);

      if (!result.success) {
        setError(result.message);
      }
      // If successful, useAuth will handle redirecting (user context is updated)
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">
          {mode === "login" ? "Login" : "Sign Up"}
        </h1>

        {error && <div className="alert alert-danger">{error}</div>}

        {mode === "login" ? (
          // LOGIN FORM
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="loginEmail">Email or Username</label>
              <input
                id="loginEmail"
                type="text"
                className="form-control"
                placeholder="Enter your email or username"
                value={email || username}
                onChange={(e) => {
                  // Try to determine if it's an email or username
                  if (e.target.value.includes("@")) {
                    setEmail(e.target.value);
                    setUsername("");
                  } else {
                    setUsername(e.target.value);
                    setEmail("");
                  }
                }}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="loginPassword">Password</label>
              <input
                id="loginPassword"
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          // SIGNUP FORM
          <form onSubmit={handleSignupSubmit}>
            <div className="form-group">
              <label htmlFor="signupEmail">Email</label>
              <input
                id="signupEmail"
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signupUsername">Username</label>
              <input
                id="signupUsername"
                type="text"
                className="form-control"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signupPassword">Password</label>
              <input
                id="signupPassword"
                type="password"
                className="form-control"
                placeholder="Enter a password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                className="form-control"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        )}

        {/* Toggle between login and signup */}
        <div className="login-toggle">
          {mode === "login" ? (
            <>
              <p>Don't have an account?</p>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => {
                  setMode("signup");
                  setError("");
                }}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <p>Already have an account?</p>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
