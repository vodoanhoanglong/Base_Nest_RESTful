import { SetMetadata } from "@nestjs/common";
import { DecoratorKey } from "@shared/enum/decorator.enum";
import { Role } from "@shared/enum/role.enum";

export const Roles = (...roles: Role[]) => SetMetadata(DecoratorKey.Roles, roles);
