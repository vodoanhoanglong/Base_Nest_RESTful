import { AuthService } from "@domain/auth/auth.service";
import { ConfirmVerificationRequest } from "@domain/auth/request/ConfirmVerification.request";
import { RefreshTokenRequest } from "@domain/auth/request/RefreshToken.request";
import { SendVerificationRequest } from "@domain/auth/request/SendVerification.request";
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

  @Post("send-verification")
  sendVerification(@Body() request: SendVerificationRequest) {
    return this.authService.sendVerification(request);
  }

  @Post("confirm-verification")
  confirmVerification(@Body() request: ConfirmVerificationRequest) {
    return this.authService.confirmVerification(request);
  }

  @Post("refresh-token")
  refreshNewToken(@Body() request: RefreshTokenRequest) {
    return this.authService.refreshNewToken(request);
  }
}
