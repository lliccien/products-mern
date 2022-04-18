import { IsEmail, IsString, IsUUID } from 'class-validator'

export class CreateUserDto {
  @IsUUID('4', { each: true })
  public _id: string

  @IsEmail()
  public email: string

  @IsString()
  public password: string
}
