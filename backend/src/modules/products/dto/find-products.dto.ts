import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindProductsDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minRamGb?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxWeightKg?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number = 0;
}
