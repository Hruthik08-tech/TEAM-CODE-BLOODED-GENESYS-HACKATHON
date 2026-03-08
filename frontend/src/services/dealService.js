/**
 * Deal API service. Single Responsibility for deal operations.
 * @param {Object} httpClient - Injected HTTP client (DIP)
 */
export function createDealService(httpClient) {
  return {
    fetchDeals: () => httpClient.get('/deals'),
    fetchDeal: (dealId) => httpClient.get(`/deals/${dealId}`),
  };
}
