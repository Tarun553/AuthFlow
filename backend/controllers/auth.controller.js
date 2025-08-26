import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import transporter from "../config/nodemail.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Send email using Brevo
    try {
      const info = await transporter.sendMail({
        from: "tarunchoudhary.work07@gmail.com",
        to: email,
        subject: "Account created successfully",
        text: `Hello ${name}, your account has been created successfully!`,
        html: `<p>Hello <b>${name}</b>,</p>
               <p>Your account has been created successfully </p>`,
      });

      console.log("Email sent:", info.messageId);
    } catch (mailError) {
      console.error("Error sending email:", mailError);
      // don’t block user creation if email fails
    }

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log(email, password);
//     if (!email || !password) {
//       return res.status(400).json({ message: "Please fill all the fields" });
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User does not exist" });
//     }
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ message: "Invalid password" });
//     }
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     // try {
//     //   const info = await transporter.sendMail({
//     //     from: "tarunchoudhary.work07@gmail.com",
//     //     to: email,
//     //     subject: "Account created successfully",
//     //     text: `Hello ${user.name}, you have successfully logged in!`,
//     //     html: `<p>Hello <b>${user.name}</b>,</p>
//     //                  <p>You have successfully logged in </p>`,
//     //   });

//     //   console.log("Email sent:", info.messageId);
//     // } catch (mailError) {
//     //   console.error("Error sending email:", mailError);
//     //   // don’t block user creation if email fails
//     // }
//     res.status(200).json({ message: "User logged in successfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set the token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "User logged in successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    if (!userId) {
      return res
        .status(400)
        .json({ message: "User not authenticated", success: false });
    }
    const user = await User.findById(userId);
    if (user.isAuthenticated) {
      return res
        .status(400)
        .json({ message: "User already verified", success: false });
    }
    console.log(user);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist", success: false });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.Verifyotp = otp;
    user.VerifyotpExpiry = Date.now() + 60 * 60 * 1000;
    await user.save();
    try {
      const info = await transporter.sendMail({
        from: "tarunchoudhary.work07@gmail.com",
        to: user.email,
        subject: "Verify your email",
        text: `Your OTP is ${otp}`,
        html: `<p>Your OTP is <b>${otp}</b></p>`,
      });
    } catch (mailError) {
      console.error("Error sending email:", mailError);
      // don’t block user creation if email fails
    }
    res.status(200).json({ message: "OTP sent successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otp } = req.body;
    console.log("Verifying OTP for user:", userId, "OTP:", otp);

    if (!otp) {
      return res
        .status(400)
        .json({ message: "Please provide OTP", success: false });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    if (user.Verifyotp !== otp) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }

    if (user.VerifyotpExpiry < Date.now()) {
      return res
        .status(400)
        .json({ message: "OTP has expired", success: false });
    }

    user.isAuthenticated = true;
    user.Verifyotp = "";
    user.VerifyotpExpiry = 0;
    await user.save();

    res
      .status(200)
      .json({ message: "Email verified successfully", success: true });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }
    if (!user.isAuthenticated) {
      return res
        .status(400)
        .json({ message: "User not authenticated", success: false });
    }
    res
      .status(200)
      .json({ message: "User authenticated successfully", success: true });
  } catch (error) {
    console.error("Error in isAuthenticated:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const sendRestOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Please provide email", success: false });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.resetPassword = otp;
    user.resetPasswordExpiry = Date.now() + 60 * 60 * 1000;
    await user.save();
    try {
      const info = await transporter.sendMail({
        from: "tarunchoudhary.work07@gmail.com",
        to: user.email,
        subject: "Reset your password",
        text: `Your OTP is ${otp}`,
        html: `<p>Your OTP is <b>${otp}</b></p>`,
      });
    } catch (mailError) {
      console.error("Error sending email:", mailError);
      // don’t block user creation if email fails
    }
    res.status(200).json({ message: "OTP sent successfully", success: true });
  } catch (error) {
    console.error("Error in sendRestOtp:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) {
      return res
        .status(400)
        .json({
          message: "Please provide email,otp and password",
          success: false,
        });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }
    if (user.resetPassword !== otp) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }
    if (user.resetPasswordExpiry < Date.now()) {
      return res
        .status(400)
        .json({ message: "OTP has expired", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPassword = "";
    user.resetPasswordExpiry = 0;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Password reset successfully",
      success: true,
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }
    console.log(user);
    res
      .status(200)
      .json({
        message: "User data fetched successfully",
        success: true,
        data: user,
      });
  } catch (error) {
    console.error("Error in getUserData:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
