import { ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { getErrorMessage } from "@shared/constant/error-message.constant";
import { DecoratorKey } from "@shared/enum/decorator.enum";
import { ErrorCode } from "@shared/enum/error-code.enum";
import { Role } from "@shared/enum/role.enum";
import { StrategyKey } from "@shared/enum/strategy.enum";
import { IRequest } from "@shared/interface/request.interface";

@Injectable()
export class JwtAuthGuard extends AuthGuard(StrategyKey.JWT) {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Authentication & Authorization flow
   *
   * @description
   * If do not set `Roles` decorator on route handler, it is the public API.
   * Otherwise, it authentication by JWT. Afterward, authorization rely on current role.
   */
  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(DecoratorKey.Roles, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) return false;

    const request = context.switchToHttp().getRequest<IRequest>();
    const user = request.user;

    if (!user) throw new ForbiddenException(getErrorMessage(ErrorCode.Unauthenticated));

    if (requiredRoles.includes(user.role)) return true;

    throw new ForbiddenException(getErrorMessage(ErrorCode.Unauthorized, user.role));
  }
}
