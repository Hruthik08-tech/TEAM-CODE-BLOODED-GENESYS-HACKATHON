/**
 * Demand service - Single Responsibility: demand CRUD and domain operations.
 * Depends on injected HTTP client (DIP).
 */
export function createDemandService(client) {
  function mapDemandFromApi(d) {
    return {
      demandId: d.demand_id,
      uuid: `DEM-${d.demand_id}`,
      name: d.item_name,
      category: d.item_category,
      status: d.is_active ? 'active' : 'inactive',
      maxPrice: parseFloat(d.max_price_per_unit) || 0,
      currency: d.currency || 'USD',
      quantity: d.quantity || 0,
      quantityUnit: d.quantity_unit || '',
      requiredBy: d.required_by,
      deliveryLocation: d.delivery_location,
      searchRadius: d.search_radius || 50,
      description: d.item_description || '',
      rating: d.rating != null ? parseFloat(d.rating) : null,
    };
  }

  return {
    async fetchAll() {
      const data = await client.get('/demand');
      return data.map(mapDemandFromApi);
    },

    async create(payload) {
      await client.post('/demand', payload);
    },

    async rate(demandId, rating) {
      await client.put(`/demand/${demandId}/rate`, { rating });
    },

    async delete(demandId) {
      await client.delete(`/demand/${demandId}`);
    },

    mapDemandFromApi,
  };
}
