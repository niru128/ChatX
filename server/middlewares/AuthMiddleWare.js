import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt; // read token from cookie
    if (!token) return res.status(401).send("Token not found");

    jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
        if (err) return res.status(403).send("Invalid Token");
        req.userId = payload.userId;
        next();
    });
};
