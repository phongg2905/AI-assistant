import { IsOptional, IsString, IsNumber, IsBoolean, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class RecommendDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budgetMaxVnd?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budgetMinVnd?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minRamGb?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minStorageGb?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxWeightKg?: number;

  @IsOptional()
  @IsBoolean()
  requiresDedicatedGpu?: boolean;

  @IsOptional()
  @IsString()
  usagePurpose?: string; // 'gaming' | 'ai' | 'coding' | 'office' | 'student'
}
