import { Roles } from "@core/decorator/role.decorator";
import { Controller, Get } from "@nestjs/common";
import { ApiVersion } from "@shared/enum/api-version.enum";
import { Role } from "@shared/enum/role.enum";
import { AppService } from "src/app.service";

@Controller({ path: "/", version: ApiVersion.V1 })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Roles(Role.Member)
  getHello(): string {
    return this.appService.getHello();
  }
}
