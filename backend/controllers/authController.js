
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Organization = require("../models/Organization");

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { organizationName, email, password } = req.body;

        // 1. Check required fields
        if (!organizationName || !email || !password) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // 2. Check whether email already exists
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        // 3. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create organization
        const organization = await Organization.create({
            name: organizationName.trim()
        });

        // 5. Create user linked to organization
        const user = await User.create({
            email: normalizedEmail,
            password: hashedPassword,
            organization: organization._id
        });

        // 6. Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                organizationId: organization._id
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 7. Send response
        res.status(201).json({
            message: "Registration successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                organization: organization.name
            }
        });

    } catch (error) {
        console.error("Signup error:", error);

        res.status(500).json({
            message: "Server error during registration"
        });
    }
};

// Login an existing user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password"
            });
        }

        // 2. Find user by email
        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 3. Compare entered password with hashed password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 4. Get organization details
        const organization = await Organization.findById(
            user.organization
        );

        // 5. Generate JWT
        const token = jwt.sign(
            {
                userId: user._id,
                organizationId: user.organization
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 6. Send response
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                organization: organization.name
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error during login"
        });
    }
};

module.exports = { registerUser, loginUser };
