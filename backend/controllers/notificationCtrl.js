import Notification from '../models/notificationModel.js';

// write docs for this

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId }).populate({
      path: 'from',
      select: 'username profileImg',
    });

    await Notification.updateMany({ to: userId }, { $set: { read: true } });

    res.status(200).json(notifications);
  } catch (error) {
    console.log('Error in get notifications controller', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.deleteMany({ to: userId });
    res.status(200).json({ message: 'Notifications deleted successfully' });
  } catch (error) {
    console.log('Error in delete notifications controller', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteSingleNotifications = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.to.toString() !== userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await Notification.findByIdAndDelete(id);
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.log(
      'Error in delete single notifications controller',
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};
