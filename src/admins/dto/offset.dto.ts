import { Matches, IsOptional } from 'class-validator';

export class OffsetDto {
  @IsOptional()
  @Matches(/^[1-9]+$/, {
    message: 'Cursor should be integer.',
  })
  page: number;

  @IsOptional()
  @Matches(/^[1-9]+$/, {
    message: 'Limit should be integer.',
  })
  limit: number;
}
