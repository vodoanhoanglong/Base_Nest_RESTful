import { PaginationDto } from "@shared/dto/pagination-request.dto";
import { IsOptional, IsString } from "class-validator";

export class GetUsersRequest extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  email?: string;
}
