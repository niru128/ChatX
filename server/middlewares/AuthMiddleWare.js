import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const bearerToken = req.headers.authorization?.split(" ")[1];
  const cookieToken = req.cookies.jwt;

  const token = bearerToken || cookieToken;
  if (!token) return res.status(401).send("Access Denied");

  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) return res.status(403).send("Invalid Token");
    req.userId = payload.userId;
    next();
  });
};
