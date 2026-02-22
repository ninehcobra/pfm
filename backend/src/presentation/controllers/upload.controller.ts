import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  Inject, 
  UseGuards,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../guards/permissions.decorator';
import { IMediaService, MEDIA_SERVICE } from '../../application/services/media.service';

@Controller('upload')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UploadController {
  constructor(
    @Inject(MEDIA_SERVICE) private mediaService: IMediaService
  ) {}

  @Post('image')
  @Permissions('system:config') // Restricted to admin
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    return this.mediaService.uploadImage(file);
  }
}
