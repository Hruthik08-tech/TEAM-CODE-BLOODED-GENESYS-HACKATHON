/**
 * Notification API service. Single Responsibility for notification operations.
 * @param {Object} httpClient - Injected HTTP client (DIP)
 */
export function createNotificationService(httpClient) {
  return {
    fetchNotifications: () => httpClient.get('/notifications'),
    markAsRead: (id) => httpClient.patch(`/notifications/${id}/read`),
    markAllAsRead: () => httpClient.patch('/notifications/read-all'),
    deleteNotification: (id) => httpClient.delete(`/notifications/${id}`),
  };
}
