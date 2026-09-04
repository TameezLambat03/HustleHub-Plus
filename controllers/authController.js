const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const users = require("../data/users");

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email and password are required"
        });
    }

    const normalisedEmail = email.trim().toLowerCase();

    const existingUser = users.find(user => user.email === normalisedEmail);

    if (existingUser) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: users.length + 1,
        name,
        email: normalisedEmail,
        password: hashedPassword
    };

    users.push(newUser);

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        }
    });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    
    const normalisedEmail = email.trim().toLowerCase();
    const user = users.find(user => user.email === normalisedEmail);

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
        message: "Login successful",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
};

const getCurrentUser = (req, res) => {
    const user = users.find(user => user.id === req.user.id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
};

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser
};