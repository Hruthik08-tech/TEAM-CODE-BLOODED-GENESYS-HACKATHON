/**
 * Service layer - Centralized exports.
 * All services receive the HTTP client for dependency injection (DIP).
 */
import { httpClient } from '../core/api/index.js';
import { createCategoryService } from './categoryService.js';
import { createSupplyService } from './supplyService.js';
import { createDemandService } from './demandService.js';
import { createMapService } from './mapService.js';
import { createRequestService } from './requestService.js';
import { createDealService } from './dealService.js';
import { createRoomService } from './roomService.js';
import { createNotificationService } from './notificationService.js';

// Default instances using app HTTP client
export const categoryService = createCategoryService(httpClient);
export const supplyService = createSupplyService(httpClient);
export const demandService = createDemandService(httpClient);
export const mapService = createMapService(httpClient);
export const requestService = createRequestService(httpClient);
export const dealService = createDealService(httpClient);
export const roomService = createRoomService(httpClient);
export const notificationService = createNotificationService(httpClient);

export {
  createCategoryService,
  createSupplyService,
  createDemandService,
  createMapService,
  createRequestService,
  createDealService,
  createRoomService,
  createNotificationService,
};
