/**
 * Request API service. Single Responsibility for request operations.
 * @param {Object} httpClient - Injected HTTP client (DIP)
 */
export function createRequestService(httpClient) {
  return {
    fetchRequests: () => httpClient.get('/requests'),
    acceptRequest: (id) => httpClient.patch(`/requests/${id}/accept`),
    rejectRequest: (id, rejectionReason) =>
      httpClient.patch(`/requests/${id}/reject`, { rejection_reason: rejectionReason }),
    createRequest: (payload) => httpClient.post('/requests', payload),
  };
}
