import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MovieVersion } from './create-movie-version.dto';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @ValidateNested({ each: true })
  @Type(() => MovieVersion)
  versions: MovieVersion[];
}
