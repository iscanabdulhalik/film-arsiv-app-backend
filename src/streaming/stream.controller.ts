import {
  Controller,
  Get,
  Res,
  Req,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { MovieService } from 'src/modules/movie/movie.service';
import { PassThrough } from 'stream';
import { Readable } from 'stream';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Role } from 'src/common/enums/role.enum';

@Controller('stream')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StreamController {
  private s3Client: S3Client;

  constructor(private readonly movieService: MovieService) {
    this.s3Client = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'AKIA6GBMD6Z2XKYWQDDR',
        secretAccessKey: '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',
      },
    });
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async streamVideo(
    @Param('id') id: string,
    @Query('quality') quality: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const movie = await this.movieService.findOne(id);

      if (!movie) {
        return res.status(404).send('Movie not found');
      }

      if (!movie.versions || movie.versions.length === 0) {
        return res.status(404).send('No versions available for this movie');
      }

      const selectedQuality = quality || '720p';
      const videoVersion = movie.versions.find(
        (version) => version.resolution === selectedQuality,
      );

      if (!videoVersion) {
        return res
          .status(404)
          .send(
            `Video not available in the selected quality: ${selectedQuality}`,
          );
      }

      const bucketName = 'film-arsiv-mp4';
      const objectKey = 'SampleVideo_1280x720_5mb.mp4';
      const range = req.headers.range || `bytes=0-`;

      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        Range: range,
      });

      const s3Response = await this.s3Client.send(command);
      const stream = s3Response.Body as Readable;

      res.writeHead(206, {
        'Content-Range': s3Response.ContentRange,
        'Content-Type': s3Response.ContentType || 'video/mp4',
        'Content-Length': s3Response.ContentLength,
        'Accept-Ranges': 'bytes',
      });

      const passThrough = new PassThrough();
      stream.pipe(passThrough);
      passThrough.pipe(res);
    } catch (error) {
      console.error('Streaming error:', error);
      res.status(500).send('Error fetching video');
    }
  }
}
