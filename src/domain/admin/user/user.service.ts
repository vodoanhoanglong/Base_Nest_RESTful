import { Account } from "@database/entity/account.entity";
import { GetUsersRequest } from "@domain/admin/user/request/GetUsers.request";
import { GetUsersResponse } from "@domain/admin/user/response/GetUsers.response";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository, FilterQuery } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { PageInfo, PaginationResponse } from "@shared/dto/pagination-response.dto";
import { Role } from "@shared/enum/role.enum";

@Injectable()
export class UserService {
  constructor(@InjectRepository(Account) private readonly accountRepository: EntityRepository<Account>) {}

  async getUsers(request: GetUsersRequest) {
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
  }
}
