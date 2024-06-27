import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { FileService } from './file.service';
import { FileController } from './file.controller';
import { AdminsModule } from '../admins/admins.module';
import { multerOptions } from './config/multer.config';

@Module({
  imports: [MulterModule.register(multerOptions), AdminsModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService], // Make FileService available to other modules
})
export class FileModule {}
