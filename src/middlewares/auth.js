import jwt from "../utils/jwt.js";

const auth = (req, res, next) => {

    const cookie = req.headers.cookie;
    const authorization = req.headers.authorization;
    const cookieToken = cookie?.split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith("authToken="))
        ?.split("=")[1];
    const bearerToken = authorization?.startsWith("Bearer ")
        ? authorization.slice(7)
        : undefined;
    const token = cookieToken || bearerToken;

    if (!token) {
        return res.status(401).send(  "User not authenticated." );
    }

    try {

        const data = jwt.verifyToken(token);

        req.user = data;

        next();

    } catch (error) {

     res.status(401).send("Invalid token.")
    }
};

export default auth;