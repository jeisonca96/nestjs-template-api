import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Delete,
  Param,
  Get,
  Query,
  BadRequestException,
  HttpStatus,
  HttpCode,
  ParseFilePipe,
  MaxFileSizeValidator,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudStorageService } from './cloud-storage.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiTagsEnum } from 'src/constants';
import {
  DeleteFileApiDocs,
  FileUploadApiDocs,
  GetSignedUrlApiDocs,
} from './apidocs/cloud-storage.apidocs';
import { AllowedRoles } from 'src/auth/decorators/allowed-roles.decorator';
import { Roles } from 'src/auth/constants';
import { GetSignedUrlDto } from './cloud-storage.dto';

@Controller(ApiTagsEnum.CloudStorage)
@ApiTags(ApiTagsEnum.CloudStorage)
export class CloudStorageController {
  constructor(private readonly storageService: CloudStorageService) {}

  @Post('upload')
  @AllowedRoles(Roles.Admin)
  @UseInterceptors(FileInterceptor('file'))
  @FileUploadApiDocs()
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
        ],
      }),
    )
    file: Express.Multer.File,
    @Query('path') path: string,
  ) {
    if (!file.buffer) {
      throw new BadRequestException('File is required', 'FILE_REQUIRED');
    }

    return this.storageService.uploadFile(file, path);
  }

  @Delete(':key')
  @AllowedRoles(Roles.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteFileApiDocs()
  async deleteFile(@Param('key') key: string) {
    return this.storageService.deleteFile(key);
  }

  @Post('signed-url')
  @AllowedRoles(Roles.Admin)
  @GetSignedUrlApiDocs()
  async getSignedUrl(@Body() body: GetSignedUrlDto) {
    return this.storageService.getSignedUrl(body.key, body.expires);
  }
}
