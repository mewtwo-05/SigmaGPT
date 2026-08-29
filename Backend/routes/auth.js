import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper: sign a JWT and set it as an HTTP-only cookie
const sendTokenCookie = (res, user) => {
    const token = jwt.sign(
        { userId: user._id, name: user.name, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie('token', token, {
        httpOnly: true,          // Not accessible via JavaScript (XSS protection)
        secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
        sameSite: 'lax',         // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Please provide name, email, and password.' });
    }

    try {
        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'An account with this email already exists.' });
        }

        // Create user — password is hashed by the pre-save hook in User model
        const user = await User.create({ name, email, password });

        sendTokenCookie(res, user);

        res.status(201).json({
            message: 'Account created successfully!',
            user: { _id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Failed to create account. Please try again.' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        sendTokenCookie(res, user);

        res.status(200).json({
            message: 'Logged in successfully!',
            user: { _id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    res.status(200).json({ message: 'Logged out successfully.' });
});

// GET /api/auth/me  — protected: returns current user info
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error('Me error:', error);
        res.status(500).json({ error: 'Failed to fetch user info.' });
    }
});

export default router;
