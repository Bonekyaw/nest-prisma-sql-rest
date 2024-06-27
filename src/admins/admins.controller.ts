import {
  Controller,
  Get,
  Query,
  // Post,
  // Body,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';

import { AdminsService } from './admins.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/role.enum';
import { OffsetDto } from './dto/offset.dto';
import { CursorDto } from './dto/cursor.dto';

/*
 * Pagination
 * There are two ways in pagination:
 * offset-based and cursor-based. Read here if you wish to know more
 * https://www.prisma.io/docs/orm/prisma-client/queries/pagination
 */

@Controller('v1/admins')
@Roles(Role.Editor, Role.Admin) // Other roles can't get access
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get('offset')
  async findByOffset(@Query() offsetDto: OffsetDto) {
    return this.adminsService.findByOffset(offsetDto);
  }

  @Get('cursor')
  async findByCursor(@Query() cursorDto: CursorDto) {
    return this.adminsService.findByCursor(cursorDto);
  }
}
