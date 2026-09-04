const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../data/users");

// ============================================================
// REGISTER USER
// ============================================================
// Creates a new client or freelancer account.
// Admin accounts cannot be created through public registration.
const registerUser = async (req, res) => {
    // Get registration information from the request body
    const { name, email, password, role } = req.body;

    // Make sure all required registration fields were provided
    if (!name || !email || !password || !role) {
        return res.status(400).json({
            message: "Name, email, password and role are required"
        });
    }

    // These are the only roles allowed during public registration.
    // Admin accounts are created separately.
    const allowedRoles = ["client", "freelancer"];

    // Reject any role that is not client or freelancer
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({
            message: "Role must be either client or freelancer"
        });
    }

    // Check whether an account already exists with this email
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    // Hash the password before storing it.
    // The plain-text password is never stored.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user object
    const newUser = {
        id: users.length + 1,
        name,
        email,
        password: hashedPassword,
        role
    };

    // Add the new user to temporary in-memory storage
    users.push(newUser);

    // Return successful registration information.
    // The password is never returned.
    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        }
    });
};


// ============================================================
// LOGIN USER
// ============================================================
// Checks the user's email and password.
// If correct, creates and returns a JWT.
const loginUser = async (req, res) => {
    // Get login details from the request body
    const { email, password } = req.body;

    // Find the user using their email
    const user = users.find(user => user.email === email);

    // Reject login if the email does not exist
    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    // Compare the supplied password with the stored bcrypt hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Reject login if the password is incorrect
    if (!passwordMatch) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    // ========================================================
    // CREATE JWT
    // ========================================================
    // The JWT contains information about the authenticated user.
    // The role is included so the API can later determine
    // what the user is allowed to access.
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    // Return the JWT after successful login
    res.json({
        message: "Login successful",

        // The client will send this token when accessing
        // protected API routes.
        token,

        // Return basic user information
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};


// ============================================================
// GET CURRENT USER
// ============================================================
// Used by the protected /me route.
//
// authMiddleware.js verifies the JWT first and places
// its contents inside req.user.
const getCurrentUser = (req, res) => {
    // Find the user using the ID stored inside the JWT
    const user = users.find(user => user.id === req.user.id);

    // If the user no longer exists, return an error
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    // Return the authenticated user's information.
    // Never return the password/hash.
    res.json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};


// ============================================================
// EXPORT CONTROLLER FUNCTIONS
// ============================================================
// These functions are imported by authRoutes.js
module.exports = {
    registerUser,
    loginUser,
    getCurrentUser
};