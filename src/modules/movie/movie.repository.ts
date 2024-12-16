import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { MovieVersion } from './entities/movie.version.entity';

@Injectable()
export class MovieRepository extends Repository<Movie> {
  constructor(private dataSource: DataSource) {
    super(Movie, dataSource.createEntityManager());
  }

  async createMovie(movie: Partial<Movie>): Promise<Movie> {
    const newMovie = super.create(movie);
    return this.save(newMovie);
  }

  async findMovies(options?: any): Promise<Movie[]> {
    return super.find({ ...options, relations: ['versions'] }); // İlişkilerin yüklendiğinden emin olun
  }

  async findOneMovie(options?: any): Promise<Movie | null> {
    return super.findOne({ ...options, relations: ['versions'] }); // İlişkilerin yüklendiğinden emin olun
  }

  async saveMovie(movie: Movie): Promise<Movie> {
    return super.save(movie);
  }

  async updateMovie(id: string, movie: Partial<Movie>): Promise<Movie | null> {
    // Ana tabloyu güncelle
    await this.update({ id }, movie);

    // İlişkisel alan (versions) güncelleniyorsa:
    if (movie.versions) {
      const existingMovie = await this.findOne({
        where: { id },
        relations: ['versions'], // Doğru ilişki adını kullanın
      });
      if (existingMovie) {
        existingMovie.versions = movie.versions; // Yeni versiyonları ilişkilendir
        await this.save(existingMovie); // Güncellemeyi kaydet
      }
    }

    return this.findOne({ where: { id } });
  }

  // Yeni bir method
  async updateMovieVersions(
    movieId: string,
    versions: MovieVersion[],
  ): Promise<void> {
    // İlişkisel alanları güncelle
    const movie = await this.findOne({
      where: { id: movieId },
      relations: ['versions'], // Yanlış ad düzeltildi
    });

    if (movie) {
      // Yeni versiyonları ilişkilendir
      movie.versions = versions;
      await this.save(movie); // Güncellemeyi kaydet
    }
  }
}
