import mongoose from "mongoose";

const objectId = mongoose.Types.ObjectId;

const adminSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String
})

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String
})

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  price: Number,
  creatorId: String
})

const purchaseSchema = new mongoose.Schema({
  userId: objectId,
  courseId: objectId
})

const adminModel = mongoose.model('admin', adminSchema);
const userModel = mongoose.model('user', userSchema);
const courseModel = mongoose.model('course', courseSchema);
const purchaseModel = mongoose.model('purchase', purchaseSchema);

export { adminModel, userModel, courseModel, purchaseModel };