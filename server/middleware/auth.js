import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'jobnest-super-secret-key-2024';

export function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = header.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
}

export function optionalAuth(req, res, next) {
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
        try {
            const token = header.split(' ')[1];
            req.user = jwt.verify(token, JWT_SECRET);
        } catch {
            // ignore invalid token
        }
    }
    next();
}

export { JWT_SECRET };
