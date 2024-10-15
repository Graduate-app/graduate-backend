import { IsBoolean, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAdminInput {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsBoolean()
  superAdmin: boolean;
}
