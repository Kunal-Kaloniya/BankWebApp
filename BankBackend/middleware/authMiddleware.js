import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Player ")) {
        return res.status(404).json({ msg: "Access denied! Token not found", authHeader });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ msg: "Access denied! Token expired" });
    }
}

export const verifyAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied! Admins only" });
    }
    next();
}