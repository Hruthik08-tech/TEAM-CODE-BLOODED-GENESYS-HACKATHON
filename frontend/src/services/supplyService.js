/**
 * Supply service - Single Responsibility: supply CRUD and domain operations.
 * Depends on injected HTTP client (DIP).
 */
export function createSupplyService(client) {
  function mapSupplyFromApi(s) {
    return {
      supplyId: s.supply_id,
      uuid: `SUP-${s.supply_id}`,
      name: s.item_name,
      category: s.item_category,
      status: s.is_active ? 'active' : 'inactive',
      price: parseFloat(s.price_per_unit) || 0,
      currency: s.currency || 'USD',
      quantity: s.quantity || 0,
      quantityUnit: s.quantity_unit || '',
      searchRadius: s.search_radius || 50,
      description: s.item_description || '',
      rating: s.rating != null ? parseFloat(s.rating) : null,
    };
  }

  return {
    async fetchAll() {
      const data = await client.get('/supply');
      return data.map(mapSupplyFromApi);
    },

    async create(payload) {
      await client.post('/supply', payload);
    },

    async rate(supplyId, rating) {
      await client.put(`/supply/${supplyId}/rate`, { rating });
    },

    async delete(supplyId) {
      await client.delete(`/supply/${supplyId}`);
    },

    mapSupplyFromApi,
  };
}
