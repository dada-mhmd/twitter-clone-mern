import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { generateTokenAndSetCookies } from '../lib/utils/generateToken.js';

export const register = async (req, res) => {
  const { fullName, username, email, password } = req.body;
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // check if username already exist in db
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // check if email already exist in db
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // check if password is less than 6 characters
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters' });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      generateTokenAndSetCookies(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.log('Error in register controller', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ''
    );
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid credentials' });
    } else {
      generateTokenAndSetCookies(user._id, res);
      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        followers: user.followers,
        following: user.following,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
      });
    }
  } catch (error) {
    console.log('Error in login controller', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log('Error in logout controller', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    console.log('Error in getMe controller', error.message);
    res.status(500).json({ error: error.message });
  }
};
