import { SignInRequest } from "@domain/auth/request/SignIn.request";
import { PickType } from "@nestjs/swagger";

export class PortalSignInRequest extends PickType(SignInRequest, ["email", "password"]) {}
