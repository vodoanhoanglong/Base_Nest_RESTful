import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationDto } from "@shared/dto/pagination-request.dto";
import { IsOptional, IsString } from "class-validator";

export class GetUsersRequest extends PaginationDto {
  @ApiPropertyOptional({ example: "name" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: "0123456789" })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: "user@example.com" })
  @IsOptional()
  @IsString()
  email?: string;
}
