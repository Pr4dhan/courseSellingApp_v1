import dotenv from "dotenv";
dotenv.config({ quiet: true });
import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { adminRouter } from "./routes/admin.js";
import { userRouter } from "./routes/user.js";
import { courseRouter } from "./routes/course.js";
// import cors from "cors";

const app = express();
app.use(express.json());
app.use(cookieParser());
// app.use(cors());

app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use('/course', courseRouter);

const Server = () => {
  mongoose.connect(process.env.DATABASE_URL);
  console.log("Database connected");
  const port = 3000;
  app.listen(port);
  console.log(`Listening on port ${port}`)
}

Server();
