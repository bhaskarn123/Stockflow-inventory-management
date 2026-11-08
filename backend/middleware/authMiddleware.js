const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        // 1. Get token from request headers
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Not authorized, token missing"
            });
        }

        // 2. Extract token
        const token = authHeader.split(" ")[1];

        // 3. Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // 4. Attach user information to request
        req.user = decoded;

        // 5. Continue to the next function
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Not authorized, invalid token"
        });
    }
};

module.exports = protect;