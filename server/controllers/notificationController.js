const { Notification } = require('../models');

// @desc    Get current user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  const notifications = await Notification.findAll({
    where: { recipientId: req.user._id },
    order: [['createdAt', 'DESC']],
    limit: 30,
  });

  const unreadCount = await Notification.count({
    where: {
      recipientId: req.user._id,
      read: false,
    }
  });

  res.json({
    success: true,
    unreadCount,
    data: notifications,
  });
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  const notification = await Notification.findOne({
    where: { _id: req.params.id, recipientId: req.user._id }
  });

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found',
    });
  }

  notification.read = true;
  await notification.save();

  res.json({
    success: true,
    data: notification,
  });
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  await Notification.update(
    { read: true },
    { where: { recipientId: req.user._id, read: false } }
  );

  res.json({
    success: true,
    message: 'All notifications marked as read',
  });
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
