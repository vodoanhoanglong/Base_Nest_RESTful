import { GetUsersRequest } from "@domain/admin/user/request/GetUsers.request";
import { UserService } from "@domain/admin/user/user.service";
import { Controller, Get, Query } from "@nestjs/common";
import { ApiVersion } from "@shared/enum/api-version.enum";

/* TODO: Add permission guard for admin controllers */
@Controller({ path: "admin/users", version: ApiVersion.V1 })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(@Query() request: GetUsersRequest) {
    return this.userService.getUsers(request);
  }
}
