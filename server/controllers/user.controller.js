import User from "../models/User.model.js";
import { generateToken } from "../middlewares/auth.middleware.js";
import { myError } from "../utils/error.js";
import bcrypt from "bcryptjs";

export const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate input
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    // 2. Check if email is already registered
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use." });
    }

    // 3. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Create the new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 5. Generate JWT, set cookie
    generateToken(newUser, res);

    // 6. Return created user info (omit password)
    const userObj = newUser.toObject();
    delete userObj.password;
    delete userObj.__v;
    res.status(201).json({
      message: "Registration successful",
      user: userObj,
    });
  } catch (err) {
    myError(err, "Error in userRegister controller");
    res.status(500).json({ message: "Server error during registration." });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // 2. Find user including hashed password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 3. Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 4. Generate JWT, set cookie
    if (req.cookies?.token) {
      return res.status(400).json({ message: "Already logged in." });
    }
    const token = generateToken(user, res);

    // 5. Return user info (exclude password) and token
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.__v;
    res.status(200).json({
      message: "Login successful",
      user: userObj,
    });
  } catch (err) {
    myError(err, "in controller userLogin");
    res.status(500).json({ message: "Server error during login." });
  }
};

export const userProfile = async (req, res) => {
  try {
    // protect middleware has attached the user document (without password) to req.user
    const user = req.user;

    // In case you want to transform the output or remove extra fields:
    const { _id, name, email, role, projects, createdAt, updatedAt } = user;
    return res.status(200).json({
      message:"get profile Success",
      user
    });
  } catch (err) {
    // Use your error-logging helper
    myError(err, "Error in userProfile controller");
    return res.status(500).json({ message: "Server error fetching profile." });
  }
};

export const userProfileUpdate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, password } = req.body;

    // 1. Fetch the current user
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 2. Update fields if provided
    if (name) user.name = name;
    if (email && email !== user.email) {
      // Check for email uniqueness
      const exists = await User.exists({ email });
      if (exists) {
        return res.status(400).json({ message: "Email already in use." });
      }
      user.email = email;
    }
    if (password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds);
    }

    // 3. Save changes
    const updatedUser = await user.save();

    // 4. Prepare response (omit password)
    const {
      _id,
      name: newName,
      email: newEmail,
      role,
      projects,
      createdAt,
      updatedAt,
    } = updatedUser;
    return res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        _id,
        name: newName,
        email: newEmail,
        role,
        projects,
        createdAt,
        updatedAt,
      },
    });
  } catch (err) {
    myError(err, "Error in userProfileUpdate controller");
    return res
      .status(500)
      .json({ message: "Server error during profile update." });
  }
};

export const userLogout = async (req, res) => {
  // Name of the cookie we set in generateToken()
  const COOKIE_NAME = "token";

  // Clear the cookie
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  // Send confirmation
  res.status(200).json({ message: "Logout successful" });
};
