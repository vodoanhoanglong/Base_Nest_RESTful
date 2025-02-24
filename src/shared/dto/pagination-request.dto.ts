import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value != null ? parseInt(value) : 1))
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value != null ? parseInt(value) : 20))
  limit: number = 20;

  get offset(): number {
    return (this.page - 1) * this.limit;
  }
}
