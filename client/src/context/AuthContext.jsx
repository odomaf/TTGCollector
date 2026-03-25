import React, { createContext, useState, useContext, useEffect } from "react";

// Create the Auth Context
// This makes auth data available to any component in the app
const AuthContext = createContext();

// ==================== AUTH CONTEXT PROVIDER ====================
// Wraps the entire app and manages:
// - Current logged-in user data
// - Loading state (while checking session)
// - Login/logout functions
// ================================================================

export const AuthProvider = ({ children }) => {
  // State to store the logged-in user (null if not logged in)
  // Structure: { id, email, username }
  const [user, setUser] = useState(null);

  // State to track if we're still loading the initial session check
  // This prevents UI flashing (showing login page briefly before loading session)
  const [isLoading, setIsLoading] = useState(true);

  // ==================== CHECK SESSION ON APP LOAD ====================
  // Runs once when the app mounts
  // Checks if user has a valid session and restores login state
  // ====================================================================

  useEffect(() => {
    const checkSessionOnLoad = async () => {
      try {
        // Check if localStorage has a login flag (user was previously logged in)
        const isLoggedIn = localStorage.getItem("isLoggedIn");

        if (isLoggedIn) {
          // If they were logged in, verify the session is still valid
          // Call /api/auth/user to check if the server session still exists
          const response = await fetch("/api/auth/user");

          if (response.ok) {
            // Session is valid! Restore user data to Context
            const data = await response.json();
            setUser(data.user);
          } else {
            // Session expired, clear localStorage
            localStorage.removeItem("isLoggedIn");
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        // Done loading, show the UI
        setIsLoading(false);
      }
    };

    checkSessionOnLoad();
  }, []); // Empty dependency array = run only once on initial mount

  // ==================== LOGIN FUNCTION ====================
  // Called when user submits the login form
  // Sends credentials to /api/auth/login
  // ========================================================

  const login = async (email, username, password) => {
    try {
      // Call the login endpoint with credentials
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email || undefined,
          username: username || undefined,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful! Save user to Context and localStorage
        setUser(data.user);
        localStorage.setItem("isLoggedIn", "true");
        return { success: true };
      } else {
        // Login failed, return error message
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Error logging in" };
    }
  };

  // ==================== SIGNUP FUNCTION ====================
  // Called when user submits the signup form
  // Sends credentials to /api/auth/signup
  // =========================================================

  const signup = async (email, username, password) => {
    try {
      // Call the signup endpoint with credentials
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Signup successful! Save user to Context and localStorage
        setUser(data.user);
        localStorage.setItem("isLoggedIn", "true");
        return { success: true };
      } else {
        // Signup failed, return error message
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, message: "Error signing up" };
    }
  };

  // ==================== LOGOUT FUNCTION ====================
  // Called when user clicks logout
  // Sends request to /api/auth/logout
  // ==========================================================

  const logout = async () => {
    try {
      // Call the logout endpoint
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      // Clear user from Context and localStorage
      setUser(null);
      localStorage.removeItem("isLoggedIn");
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, message: "Error logging out" };
    }
  };

  // Provide auth state and functions to all child components
  const value = {
    user, // Current logged-in user (null if not logged in)
    isLoading, // Loading state (true while checking session)
    login, // Function to login
    signup, // Function to signup
    logout, // Function to logout
    isAuthenticated: !!user, // True if user is logged in (for convenience)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ==================== USEAUTH HOOK ====================
// Custom hook to access auth context from any component
// Usage: const { user, login, logout } = useAuth();
// =======================================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
