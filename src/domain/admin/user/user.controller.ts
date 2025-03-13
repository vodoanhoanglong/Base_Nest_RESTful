import { ApiExtraModelsCustom, ApiResponseCustom } from "@core/decorator/doc.decorator";
import { ChangeUserPasswordRequest } from "@domain/admin/user/request/ChangeUserPassword.request";
import { GetUsersRequest } from "@domain/admin/user/request/GetUsers.request";
import response from "@domain/admin/user/response";
import { GetUserDetailsResponse } from "@domain/admin/user/response/GetUserDetails.response";
import { GetUsersResponse } from "@domain/admin/user/response/GetUsers.response";
import { UserService } from "@domain/admin/user/user.service";
import { Body, Controller, Get, Param, Put, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiVersion } from "@shared/enum/api-version.enum";

/* TODO: Add permission guard for admin controllers */
@ApiTags("User Management")
@ApiExtraModelsCustom(...response)
@Controller({ path: "admin/users", version: ApiVersion.V1 })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiResponseCustom(GetUsersResponse, true)
  getUsers(@Query() request: GetUsersRequest) {
    return this.userService.getUsers(request);
  }

  @Get(":id")
  @ApiResponseCustom(GetUserDetailsResponse)
  getUserById(@Param("id") id: string) {
    return this.userService.getUserById(id);
  }

  @Put(":id/status")
  @ApiResponseCustom()
  toggleUserStatus(@Param("id") id: string) {
    return this.userService.toggleUserStatus(id);
  }

  @Put(":id/change-password")
  @ApiResponseCustom()
  changeUserPassword(@Param("id") id: string, @Body() request: ChangeUserPasswordRequest) {
    return this.userService.changeUserPassword(id, request);
  }
}
