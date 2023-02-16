import { ApiProperty } from '@nestjs/swagger';

export class AddFollowerDto {
  @ApiProperty()
  readonly userId: string;

  @ApiProperty()
  readonly followId: string;
}
