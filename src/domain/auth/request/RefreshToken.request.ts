import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Your access token" })
  token: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Your refresh token" })
  refreshToken: string;
}
