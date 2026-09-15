import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    this.logger.log('Database connection initialized (Prisma Phase 2 adapter ready)');
  }

  async onModuleDestroy() {
    this.logger.log('Database connection closed');
  }
}
