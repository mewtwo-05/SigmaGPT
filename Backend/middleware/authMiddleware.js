import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    // Read JWT from the HTTP-only cookie set on login/register
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ error: 'Access denied. Please log in.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { userId, name, email, iat, exp }
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
    }
};

export default authMiddleware;
