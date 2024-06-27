import {
  // Body,
  Controller,
  // ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/role.enum';
import { FileService } from './file.service';
import { User } from '../auth/decorators/user.decorator';

@Controller('v1/file')
@Roles(Role.Editor, Role.Admin) // Other roles can't get access
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async upload(@User() authUser, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'Fail to upload file. Check it out, please.',
      );
    }
    return this.fileService.addProfile(authUser, file);
  }
}
