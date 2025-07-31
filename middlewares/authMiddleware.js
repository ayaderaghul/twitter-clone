const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({error: 'no token provide'})
        }

        const token = authHeader.split(' ')[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = { id: decoded.id }

        next()

    } catch (error) {
        return res.status(401).json({error: 'invalid or expired token'})
    }
}

module.exports = {authMiddleware}