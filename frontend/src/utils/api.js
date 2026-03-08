/**
 * Legacy API export - delegates to core HTTP client.
 * Preserves backward compatibility while centralizing implementation.
 */
import { httpClient } from '../core/api/index.js';

export const api = httpClient;
