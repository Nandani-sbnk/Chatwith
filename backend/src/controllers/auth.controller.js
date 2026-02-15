import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";



export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields required" });
    }

    if(password.length <6){
      return res.status(400).json({message: "Password must be at least 6 character"})
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if(!emailRegex.test(email)){
      return res.status(400).json({message:"Invalid email format"})
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already used" });

    const avatar = `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100)+1}.png`;

    const user = await User.create({
      email,
      password,
      fullName,
      profilePicture: avatar
    });

    await upsertStreamUser({
      id: user._id.toString(),
      name: user.fullName,
      image: user.profilePicture
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
    res.cookie("jwt", token, {
      maxAge:7*24*60*60*1000,
      httpOnly:true,
      sameSite:"strict",
      secure:process.env.NODE_ENV ==="production"
    });

    res.status(201).json({ success: true, user });
  } catch (error) {
  console.error("Signup error:", error);
  res.status(500).json({ message: "Server error", error: error.message });
}

}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    if(!email || !password){
      return res.status(400).json({message:"All fields are required"})
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
    res.cookie("jwt", token, {
      maxAge:7*24*60*60*1000,
      httpOnly:true,
      sameSite:"strict",
      secure:process.env.NODE_ENV ==="production"
    });

    res.status(200).json({ success: true, user });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logged out" });
}

export async function onboard(req, res) {
  const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

  try {
    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...req.body, onboardingCompleted: true },
      { new: true }
    );

    await upsertStreamUser({
      id: user._id.toString(),
      name: user.fullName,
      image: user.profilePicture
    });

    res.status(200).json({ success: true, user });
  } catch {
    res.status(500).json({ message: "Onboarding failed" });
  }
}
