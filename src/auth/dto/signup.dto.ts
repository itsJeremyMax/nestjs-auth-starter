import { Transform } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';

export class SignUpDTO {
  @IsEmail()
  @Length(0, 100)
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  email: string;
  @IsString()
  @Length(8, 60)
  password: string;
}
