import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
const ADMIN = process.env.ADMIN_MIDDLEWARE;

const adminMiddleware = (req, res, next) => {
  // const token = req.headers.token;
  const token = req.cookies.token;
  const creator = jwt.verify(token, ADMIN);
  req.creatorId = creator.adminId;
  next();
}

export { adminMiddleware };