/**
 * Business room API service. Single Responsibility for room/chat operations.
 * @param {Object} httpClient - Injected HTTP client (DIP)
 */
export function createRoomService(httpClient) {
  return {
    fetchRooms: () => httpClient.get('/rooms'),
    fetchRoom: (roomId) => httpClient.get(`/rooms/${roomId}`),
    fetchMessages: (roomId) => httpClient.get(`/rooms/${roomId}/messages`),
    updateRoomStatus: (roomId, status) =>
      httpClient.patch(`/rooms/${roomId}/status`, { status }),
    sendMessage: (roomId, content) =>
      httpClient.post(`/rooms/${roomId}/messages`, { content }),
  };
}
