import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return TechWise gateway info', () => {
      const res = appController.getHello() as any;
      expect(res.service).toBe('TechWise API Gateway');
      expect(res.endpoints.recommend).toContain('/api/recommend');
    });
  });
});
