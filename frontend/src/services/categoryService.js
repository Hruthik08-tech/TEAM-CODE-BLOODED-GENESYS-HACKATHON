/**
 * Category service - Single Responsibility: fetch and transform category data.
 * Depends on injected HTTP client (DIP).
 */
export function createCategoryService(client) {
  return {
    async fetchCategories() {
      const data = await client.get('/categories');
      return Array.isArray(data) ? data.map((c) => c.category_name) : [];
    },
  };
}
