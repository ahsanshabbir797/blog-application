import { IsOptional, Min, Max, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @Min(1)
  //   @Type(() => Number) // not needed as implicit type conversion enabled globally
  @Max(100) // Good practice: Prevent users from requesting 1,000,000 rows
  limit: number = 10;

  @IsOptional()
  @IsPositive()
  @Min(1) // Explicitly states page 1 is the floor
  page: number = 1;
}
