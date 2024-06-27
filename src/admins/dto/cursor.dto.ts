import { Matches, IsOptional } from 'class-validator';

export class CursorDto {
  @IsOptional()
  @Matches(/^[1-9]+$/, {
    message: 'Cursor should be integer.',
  })
  cursor: number;

  @IsOptional()
  @Matches(/^[1-9]+$/, {
    message: 'Limit should be integer.',
  })
  limit: number;
}
