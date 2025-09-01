// users/src/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserProfile } from './models/user-profile.model';

type JwtUser = {
  sub: string;
  preferred_username?: string;
  email?: string;
};

@Injectable()
export class UsersService {
  constructor(@InjectModel(UserProfile) private readonly userModel: typeof UserProfile) {}

  async getOrProvisionMe(u: JwtUser) {
    const [row] = await this.userModel.findOrCreate({
      where: { sub: u.sub },
      defaults: {
        sub: u.sub,
        email: u.email ?? null,
        displayName: u.preferred_username ?? null,
      },
    });
    return row;
  }
}
