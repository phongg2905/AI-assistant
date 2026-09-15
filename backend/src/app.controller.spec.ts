import { describe, it, expect } from 'vitest';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  it('should return health status', () => {
    const service = new AppService();
    const controller = new AppController(service);
    const health = controller.health();
    expect(health.status).toBe('ok');
    expect(health.service).toBe('TechWise Backend');
  });
});
