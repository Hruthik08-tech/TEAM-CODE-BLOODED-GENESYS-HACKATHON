/**
 * Map-related API services. Decouples map data fetching from UI.
 * @param {Object} httpClient - Injected HTTP client (DIP)
 */
export function createMapService(httpClient) {
  return {
    fetchOrganisations: () => httpClient.get('/organisations'),
    fetchDealPartners: () => httpClient.get('/deals/map/partners'),
    fetchMatchResults: (type, id) =>
      type === 'demand'
        ? httpClient.get(`/demand/${id}/search`)
        : httpClient.get(`/supply/${id}/search`),
  };
}
