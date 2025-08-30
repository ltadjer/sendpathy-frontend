import api from './api.service'

export default {
  /**
   * Fetch all conversations for the logged-in user.
   */
  async fetchAllNotifications() {
    try {
      const response = await api.get('/notifications')
      return response.data
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw new Error('Failed to fetch notifications')
    }
  },

  async markAsRead(notificationId) {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`)
      return response.data
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw new Error('Failed to mark notification as read')
    }
  },

  async updateNotificationMessage(notificationId, message) {
    try {
      const response = await api.patch(`/notifications/${notificationId}`, { message })
      return response.data
    } catch (error) {
      console.error('Error updating notification message:', error)
      throw new Error('Failed to update notification message')
    }
  },
  async deleteOneNotification(notificationId) {
    try {
      return await api.delete(`/notifications/${notificationId}`)
    } catch (error) {
      console.error('Error deleting notification:', error)
      throw new Error('Failed to delete notification')
    }
  }
}
