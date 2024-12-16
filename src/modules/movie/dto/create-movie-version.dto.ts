import { IsEnum, IsUrl } from 'class-validator';
import { Movie } from '../entities/movie.entity';

export class MovieVersion {
  id: string; // Zorunlu bir alan
  resolution: string;
  file_url: string;
  movie: Movie; // Zorunlu bir ilişki
}
