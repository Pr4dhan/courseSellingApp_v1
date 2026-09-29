import express from "express";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { adminModel, courseModel } from "../db.js";
import { adminMiddleware } from "../middleware/admin.js";

const saltRounds = 10;


const ADMIN = process.env.ADMIN_MIDDLEWARE
const adminRouter = express.Router();

adminRouter.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const hash = await bcrypt.hash(password, saltRounds);
    const admin = {
      email: email,
      password: hash,
      firstName: firstName,
      lastName: lastName
    }
    await adminModel.create(admin)
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

adminRouter.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({ email })
    
    const isValid = admin && await bcrypt.compare(password, admin.password)

    if (!isValid) {
      return res.json({
        message: "Invalid Credential"
      })
    }

    const token = jwt.sign({ adminId: admin._id }, ADMIN)
    res.cookie("token", token);
    res.json({
      message: "Signin successful"
    })
  } catch (error) {
    console.log(error);
    res.json({
      message: "Something went wrong"
    })
  }
})

adminRouter.post('/course', adminMiddleware, async (req, res) => {
  try {
    const creatorId = req.creatorId
    const { title, description, imageUrl, price } = req.body;
    const course = {
      title: title,
      description: description,
      imageUrl: imageUrl,
      price: price,
      creatorId: creatorId
    }
    const newCourse = await courseModel.create(course)
    const creator = await adminModel.findOne({_id: newCourse.creatorId})
    res.json({
      message: "Course created successfully",
      courseId: newCourse._id,
      title: newCourse.title,
      creator: creator.firstName
    })
  } catch (error) {
    console.log(error);
    res.json({
      message: "Something went wrong"
    })
  }
})

adminRouter.put('/course', adminMiddleware, async (req, res) => {
  try {
    const creatorId = req.creatorId
    const { title, description, imageUrl, price, courseId } = req.body;
    const newCourse = await courseModel.findOneAndUpdate({ creatorId: creatorId, _id: courseId }, {
      title: title,
      description: description,
      imageUrl: imageUrl,
      price: price
    }, {
      returnDocument: "after"
    })
    const creator = await adminModel.findOne({_id: newCourse.creatorId})
    res.json({
      message: "Course updated successfully",
      courseId: newCourse._id,
      title: newCourse.title,
      creator: creator.firstName
    })
  } catch (error) {
    console.log();
    res.json({
      message: "Somthing went wrong"
    })
  }
})

adminRouter.delete('/course', adminMiddleware, async (req, res) => {
  try {
    const creatorId = req.creatorId
    const { courseId } = req.body;
    const newCourse = await courseModel.findOneAndDelete({ creatorId: creatorId, _id: courseId })
    const creator = await adminModel.findOne({_id: newCourse.creatorId})
    res.json({
      message: "Course deleted successfully",
      creator: creator.firstName
    })
  } catch (error) {
    console.log();
    res.json({
      message: "Somthing went wrong"
    })
  }
})

adminRouter.get('/course/bulk', adminMiddleware, async (req, res) => {
  try {
    const creatorId = req.creatorId;
    const courses = await courseModel.find({ creatorId });
    res.json({
      courses
    })
  } catch (error) {
    console.log(error);
    res.json({
      courses
    })
  }
})

export { adminRouter }
