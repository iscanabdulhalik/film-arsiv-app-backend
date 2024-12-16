import { Module } from '@nestjs/common';
import { MovieModule } from 'src/modules/movie/movie.module';
import { StreamController } from './stream.controller';
import { MovieService } from 'src/modules/movie/movie.service';
import { MovieRepository } from 'src/modules/movie/movie.repository';

@Module({
  imports: [MovieModule],
  controllers: [StreamController],
  providers: [MovieService, MovieRepository],
})
export class StreamModule {}
