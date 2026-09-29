import express from "express";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userModel, courseModel, purchaseModel } from "../db.js";
import { userMiddleware } from "../middleware/user.js";

const saltRounds = 10;

const USER = process.env.USER_MIDDLEWARE
const userRouter = express.Router();

userRouter.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const hash = await bcrypt.hash(password, saltRounds);
    const user = {
      email: email,
      password: hash,
      firstName: firstName,
      lastName: lastName
    }
    await userModel.create(user)
    res.json({
      message: "Signup successful"
    })
  } catch (error) {
    console.log(error);
    res.json({
      message: "Something went wrong"
    })
  }
})

userRouter.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    const isValid = user && await bcrypt.compare(password, user.password)

    if (!isValid) {
      return res.json({
        message: "Invalid Credential"
      })
    }
    const token = jwt.sign({ userId: user._id }, USER)
    res.cookie("token", token);
    res.json({
      message: "Signin successful"
      // token: token
    })
  } catch (error) {
    console.log(error);
    res.json({
      message: "Something went wrong"
    })
  }
})

userRouter.get('/purchases', userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const purchases = await purchaseModel.find({ userId: userId })
    const coursesId = purchases.map(purchases => purchases.courseId);
    const coursesData = await courseModel.find({
      _id: {$in: coursesId}
    })
    res.json({
      purchases,
      coursesData
    })
  } catch (error) {
    console.log(error);
    res.json({
      message: "Something went wrong"
    })
  }
})

export { userRouter };
