import dotenv from "dotenv";
dotenv.config({ quiet: true })

import express from "express";
import { userMiddleware } from "../middleware/user.js";
import { courseModel, purchaseModel } from "../db.js";

const courseRouter = express.Router();

courseRouter.post('/purchase', userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId } = req.body;
    const oldPurchase = await purchaseModel.findOne({ userId: userId, courseId: courseId })
    if (oldPurchase) {
      return res.json({
        message: "Already purchased"
      })
    }
    const newPurchase = await purchaseModel.create({ userId: userId, courseId: courseId })
    const course = await courseModel.findOne({ _id: newPurchase.courseId })
    res.json({
      message: "Purchase successful",
      purchaseId: newPurchase._id,
      title: course.title
    })
  } catch (error) {
    console.log(error);
    res.json({
      message: "Something went wrong"
    })
  }
})

courseRouter.get('/preview', async (req, res) => {
  try {
    const courses = await courseModel.find({})
    res.json({
      courses
    })
  } catch (error) {
    console.log(error);
    res.json({
      message: "Something went wrong"
    })
  }
})

export {courseRouter}