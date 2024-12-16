import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieRepository } from './movie.repository';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MovieService {
  constructor(private readonly movieRepository: MovieRepository) {}

  async create(createMovieDto: CreateMovieDto) {
    const movie = this.movieRepository.create(createMovieDto);
    return this.movieRepository.save(movie);
  }

  async findAll() {
    return this.movieRepository.findMovies();
  }

  async findOne(id: string) {
    return this.movieRepository.findOneMovie({ where: { id } }); // Versions ilişkisinin yüklendiğinden emin ol
  }

  async update(
    id: string,
    updateMovieDto: UpdateMovieDto,
  ): Promise<Movie | null> {
    return this.movieRepository.updateMovie(id, updateMovieDto);
  }
}
