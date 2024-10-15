import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProfilePictureService } from './graduand/services/profile-pictures.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly profilePictureService: ProfilePictureService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload-picture')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/pictures', // folder where avatars will be saved
        filename: (req, file, callback) => {
          // Generate a unique filename
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname); // get file extension
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        // File type validation (accept only images)
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadPicture(@UploadedFile() file: Express.Multer.File) {
    return await this.profilePictureService.createProfilePictures(
      `/public/pictures/${file.filename}`,
    );
  }
}
