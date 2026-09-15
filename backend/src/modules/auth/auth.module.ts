import { Module } from '@nestjs/common';

/**
 * AuthModule
 * Boundary for future Authentication (JWT / Session / OAuth).
 * In Phase 1, establishes architectural boundary without premature complexity.
 */
@Module({
  providers: [],
  exports: [],
})
export class AuthModule {}
