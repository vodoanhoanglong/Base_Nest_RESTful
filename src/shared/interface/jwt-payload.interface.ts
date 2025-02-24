import { Role } from "@shared/enum/role.enum";
import { TokenIssuer } from "@shared/enum/token.enum";

export interface IJwtPayload {
  sub: string;
  role: Role;
  iat: number;
  exp: number;
  iss: TokenIssuer;
}

export interface IJwtDecoded {
  header: { alg: string; typ?: string };
  payload: IJwtPayload;
  signature?: string;
}
