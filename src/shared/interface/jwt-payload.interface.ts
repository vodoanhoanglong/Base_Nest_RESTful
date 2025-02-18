import { Role } from "@shared/enum/role.enum";

export interface IJwtPayload {
  sub: string;
  role: Role;
  iat?: number;
  exp?: number;
}
