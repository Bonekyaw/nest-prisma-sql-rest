import { Injectable } from '@nestjs/common';
import { Express } from 'express';
import { unlink } from 'node:fs/promises';

import { AdminsService } from '../admins/admins.service';
import { MyLoggerService } from '../my-logger/my-logger.service';

@Injectable()
export class FileService {
  constructor(private adminsService: AdminsService) {}
  private readonly logger = new MyLoggerService(FileService.name);

  async addProfile(admin: any, file: Express.Multer.File) {
    const imageUrl = file.path.replace('\\', '/');
    if (admin.profile) {
      // Delete an old profile image because it accepts just one.

      try {
        await unlink(admin.profile);
      } catch (error) {
        this.logger.log(
          ` - Profile file is missing in this ${admin.phone}`,
          FileService.name,
        );
        const adminData = {
          profile: imageUrl,
        };
        await this.adminsService.update(admin.id, adminData);
      }
    }
    const adminData = {
      profile: imageUrl,
    };
    await this.adminsService.update(admin.id, adminData);

    return { message: 'Successfully uploaded the image.', profile: imageUrl };
  }
}
