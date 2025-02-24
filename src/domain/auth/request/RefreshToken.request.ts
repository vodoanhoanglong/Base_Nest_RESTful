import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenRequest {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
