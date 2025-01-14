import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { AuthService } from 'src/auth/auth.service';
import { users } from './data/users';

@Injectable()
export class SeedCommand {
  constructor(private readonly authService: AuthService) {}
  @Command({
    command: 'seed:users',
    describe: 'create a user',
  })
  async users() {
    for (const user of users) {
      await this.authService.signUp(user);
    }
  }
}
