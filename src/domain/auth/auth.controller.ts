import { AuthService } from "@domain/auth/auth.service";
import { SignInRequest } from "@domain/auth/request/SignIn.request";
import { SignUpRequest } from "@domain/auth/request/SignUp.request";
import { Body, Controller, Post } from "@nestjs/common";
import { ApiVersion } from "@shared/enum/api-version.enum";

@Controller({ path: "auth", version: ApiVersion.V1 })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-in")
  signIn(@Body() request: SignInRequest) {
    return this.authService.signIn(request);
  }

  @Post("sign-up")
  signUp(@Body() request: SignUpRequest) {
    return this.authService.signUp(request);
  }
}
