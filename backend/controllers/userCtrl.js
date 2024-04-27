import Notification from '../models/notificationModel.js';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

import User from '../models/userModel.js';

export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.log(`Error in user profile controller`, error.message);
    res.status(500).json({ error: error.message });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToFollowOrUnfollow = await User.findById(id);
    const currentUser = await User.findById(req.user._id);
    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }
    if (!userToFollowOrUnfollow || !currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      // unfollow
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: 'Unfollowed successfully' });
    } else {
      // follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      //   send notification to user
      const newNotification = new Notification({
        type: 'follow',
        from: req.user._id,
        to: userToFollowOrUnfollow._id,
      });
      await newNotification.save();
      res.status(200).json({ message: 'Followed successfully' });
    }
  } catch (error) {
    console.log('Error in follow unfollow controller', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollowedByMe = await User.findById(userId).select('following');
    const users = await User.aggregate([
      {
        $match: { _id: { $ne: userId } },
      },
      //   { $sample: { size: 10 } },
      { $sample: { size: 4 } },
    ]);

    // const filteredUsers = users.filter(
    //   (user) => !usersFollowedByMe.following.includes(user._id)
    // );
    // const suggestedUsers = filteredUsers.slice(0, 4);

    const suggestedUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log('Error in suggested users controller', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { fullName, username, email, currentPassword, newPassword, bio, link } =
    req.body;

  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res
        .status(400)
        .json({ error: 'Please provide both current and new password' });
    }

    if (newPassword && currentPassword) {
      const isPasswordCorrect = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordCorrect)
        return res.status(400).json({ error: 'Incorrect password' });
      if (newPassword.length < 6)
        return res
          .status(400)
          .json({ error: 'Password must be at least 6 characters' });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
    }

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader
          .destroy(user.profileImg.split('/'))
          .pop()
          .split('.')[0];
      }
      const uploadedImg = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedImg.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader
          .destroy(user.coverImg.split('/'))
          .pop()
          .split('.')[0];
      }
      const uploadedImg = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedImg.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();

    user.password = null;

    res.status(200).json(user);
  } catch (error) {
    console.log('Error in update user controller', error.message);
    res.status(500).json({ error: error.message });
  }
};
