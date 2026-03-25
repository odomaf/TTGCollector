const router = require("express").Router();
const { User } = require("../../models");

// ==================== SIGNUP ROUTE ====================
// POST /api/auth/signup
// Creates a new user account
// Expected body: { email, username, password }
// ======================================================

router.post("/signup", async (req, res) => {
  try {
    // Destructure user input from request body
    const { email, username, password } = req.body;

    // Validate that all required fields are provided
    if (!email || !username || !password) {
      return res.status(400).json({
        message: "Email, username, and password are required",
      });
    }

    // Create a new User in the database
    // The beforeCreate hook will automatically hash the password
    const user = await User.create({
      email,
      username,
      password,
    });

    // Save user ID to session for automatic login after signup
    // Await the save so the session is persisted before the response is sent;
    // without this, the client's immediate fetchGames() call would hit a 401
    // because the session wouldn't be in the database yet.
    req.session.userId = user.id;
    await new Promise((resolve, reject) => {
      req.session.save((err) => (err ? reject(err) : resolve()));
    });

    // Return success response (don't send password back to client)
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    // Handle validation errors (duplicate email, invalid email format, etc.)
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors.map((e) => e.message),
      });
    }

    // Handle unique constraint errors (email or username already exists)
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Email or username already in use",
      });
    }

    // Handle unexpected errors
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Error creating user",
    });
  }
});

// ==================== LOGIN ROUTE ====================
// POST /api/auth/login
// Authenticates a user and starts a session
// Expected body: { email, password } OR { username, password }
// ========================================================

router.post("/login", async (req, res) => {
  try {
    // Destructure login credentials from request body
    // User can login with either email or username
    const { email, username, password } = req.body;

    // Validate that login credentials are provided
    if (!password || (!email && !username)) {
      return res.status(400).json({
        message: "Email/username and password are required",
      });
    }

    // Find user by email OR username (whichever was provided)
    const user = await User.findOne({
      where: email ? { email } : { username },
    });

    // If user not found, return error (don't specify if email or username doesn't exist for security)
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Compare the provided password with the hashed password in the database
    // This uses the comparePassword instance method we defined in the User model
    const isValidPassword = await user.comparePassword(password);

    // If password doesn't match, return error
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Password is correct! Save user ID to session
    // Await the save so the session is persisted before the response is sent;
    // without this, the client's immediate fetchGames() call would hit a 401
    // because the session wouldn't be in the database yet.
    req.session.userId = user.id;
    await new Promise((resolve, reject) => {
      req.session.save((err) => (err ? reject(err) : resolve()));
    });

    // Return success response
    res.status(200).json({
      message: "Logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Error logging in",
    });
  }
});

// ==================== GET USER SESSION ====================
// GET /api/auth/user
// Returns the current logged-in user's info if session exists
// Used on app startup to restore login state after refresh
// =========================================================

router.get("/user", async (req, res) => {
  try {
    // Check if userId exists in the session
    if (!req.session.userId) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    // Find the user by the ID stored in the session
    const user = await User.findByPk(req.session.userId);

    // If user doesn't exist (shouldn't happen, but defensive programming)
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Return user data (everything except password)
    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Get user session error:", error);
    res.status(500).json({
      message: "Error retrieving user session",
    });
  }
});

// ==================== LOGOUT ROUTE ====================
// POST /api/auth/logout
// Destroys the user's session and logs them out
// No request body required
// ========================================================

router.post("/logout", (req, res) => {
  // Destroy the session (removes user ID and session data)
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({
        message: "Error logging out",
      });
    }

    // Clear the session cookie on the client side
    res.clearCookie("connect.sid"); // Default session cookie name

    res.status(200).json({
      message: "Logged out successfully",
    });
  });
});

module.exports = router;
