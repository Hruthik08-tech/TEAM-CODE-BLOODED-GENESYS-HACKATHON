/**
 * Default HTTP client instance. Single export point for application-wide use.
 * Dependencies can inject a different client for testing.
 */
import { createHttpClient } from './createHttpClient.js';

export const httpClient = createHttpClient();
export { createHttpClient };
