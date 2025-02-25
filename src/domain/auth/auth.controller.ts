import { ApiExtraModelsCustom, ApiResponseCustom } from "@core/decorator/doc.decorator";
import { AuthService } from "@domain/auth/auth.service";
import { ConfirmVerificationRequest } from "@domain/auth/request/ConfirmVerification.request";
import { RefreshTokenRequest } from "@domain/auth/request/RefreshToken.request";
import { SendVerificationRequest } from "@domain/auth/request/SendVerification.request";
import { SignInRequest } from "@domain/auth/request/SignIn.request";
import { SignUpRequest } from "@domain/auth/request/SignUp.request";
import response from "@domain/auth/response";
import { SignInResponse } from "@domain/auth/response/SignIn.response";
import { VerificationCodeResponse } from "@domain/auth/response/VerificationCode.response";
import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiVersion } from "@shared/enum/api-version.enum";

@ApiTags("Authenticate")
@ApiExtraModelsCustom(...response)
@Controller({ path: "auth", version: ApiVersion.V1 })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-in")
  @ApiResponseCustom(SignInResponse)
  signIn(@Body() request: SignInRequest) {
    return this.authService.signIn(request);
  }

  @Post("sign-up")
  @ApiResponseCustom()
  signUp(@Body() request: SignUpRequest) {
    return this.authService.signUp(request);
  }

  @Post("send-verification")
  @ApiResponseCustom(VerificationCodeResponse)
  sendVerification(@Body() request: SendVerificationRequest) {
    return this.authService.sendVerification(request);
  }

  @Post("confirm-verification")
  @ApiResponseCustom()
  confirmVerification(@Body() request: ConfirmVerificationRequest) {
    return this.authService.confirmVerification(request);
  }

  @Post("refresh-token")
  @ApiResponseCustom(SignInResponse)
  refreshNewToken(@Body() request: RefreshTokenRequest) {
    return this.authService.refreshNewToken(request);
  }
}
