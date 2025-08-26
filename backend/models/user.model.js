import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAuthenticated: {
    type: Boolean,
    default: false,
  },
  Verifyotp: {
    type: String,
    default: "",
  },
  VerifyotpExpiry: {
    type: Number,
    default: 0,
  },
  resetPassword: {
    type: String,
    default: "",
  },
  resetPasswordExpiry: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
