import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
const USER = process.env.USER_MIDDLEWARE;

const userMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  const user = jwt.verify(token, USER);
  req.userId = user.userId;
  next();
}

export { userMiddleware };
