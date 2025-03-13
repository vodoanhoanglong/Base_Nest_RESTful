import { Account } from "@database/entity/account.entity";
import { ChangeUserPasswordRequest } from "@domain/admin/user/request/ChangeUserPassword.request";
import { GetUsersRequest } from "@domain/admin/user/request/GetUsers.request";
import { GetUserDetailsResponse } from "@domain/admin/user/response/GetUserDetails.response";
import { GetUsersResponse } from "@domain/admin/user/response/GetUsers.response";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository, FilterQuery } from "@mikro-orm/postgresql";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PageInfo, PaginationResponse } from "@shared/dto/pagination-response.dto";
import { ErrorCode } from "@shared/enum/error-code.enum";
import { Role } from "@shared/enum/role.enum";
import { hashPassword } from "@shared/helper/hash";
import { BaseResponse } from "@shared/helper/response";

@Injectable()
export class UserService {
  constructor(@InjectRepository(Account) private readonly accountRepository: EntityRepository<Account>) {}

  async getUsers(request: GetUsersRequest) {
    try {
      const { email, phoneNumber, name, page, limit, offset } = request;

      const filters: FilterQuery<Account>[] = [];
      if (email) filters.push({ email: { $ilike: `%${email}%` } });
      if (phoneNumber) filters.push({ phoneNumber: { $ilike: `%${phoneNumber}%` } });
      if (name) filters.push({ name: { $ilike: `%${name}%` } });

      const [users, total] = await this.accountRepository.findAndCount(
        {
          $and: [{ role: Role.Member }, ...filters],
        },
        {
          limit,
          offset,
          orderBy: { createdAt: "DESC" },
        },
      );

      const data = users.map((member) => GetUsersResponse.fromEntity(member));

      return PaginationResponse.of({ data, paging: new PageInfo(page, limit, total) });
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.accountRepository.findOne({
        id,
      });
      if (!user) throw new NotFoundException(ErrorCode.UserNotFound);

      return BaseResponse.of(GetUserDetailsResponse.fromEntity(user));
    } catch (error) {
      throw error;
    }
  }

  async toggleUserStatus(id: string) {
    try {
      const user = await this.accountRepository.findOne({
        id,
        role: Role.Member,
      });
      if (!user) throw new NotFoundException(ErrorCode.UserNotFound);

      await this.accountRepository.nativeUpdate({ id }, { isActive: !user.isActive });

      return BaseResponse.ok();
    } catch (error) {
      throw error;
    }
  }

  async changeUserPassword(id: string, request: ChangeUserPasswordRequest) {
    try {
      const accountExisted = await this.accountRepository.findOne(
        {
          id,
          isActive: true,
        },
        { fields: ["id"] as Array<keyof Account> },
      );
      if (!accountExisted) throw new NotFoundException(ErrorCode.UserNotFound);

      const hashedPassword = await hashPassword(request.password);
      await this.accountRepository.nativeUpdate({ id }, { password: hashedPassword });

      return BaseResponse.ok();
    } catch (error) {
      throw error;
    }
  }
}
