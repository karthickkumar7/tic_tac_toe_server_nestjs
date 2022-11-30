import { IsNotEmpty, IsString, Length } from 'class-validator';

export class PlayWithFriendDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 15)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  roomId: string;
}
