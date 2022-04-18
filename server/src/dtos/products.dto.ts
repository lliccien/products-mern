import { IsNotEmpty, IsNumberString, IsString, IsUrl, IsUUID } from 'class-validator'

export class CreateProductDto {
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  public _id: string

  @IsString()
  @IsNotEmpty()
  public name: string

  @IsString()
  public description?: string

  @IsNumberString()
  public quantity?: string

  @IsNumberString()
  public amount?: string

  @IsString()
  public image?: string
}
