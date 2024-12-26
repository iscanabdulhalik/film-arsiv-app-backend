import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { Movie } from './movie.entity';

@Entity()
export class MovieVersion {
  @PrimaryColumn('uuid', { default: () => 'gen_random_uuid()' })
  id: string;

  @Column({ nullable: false })
  resolution: string;

  @Column()
  file_url: string;

  @ManyToOne(() => Movie, (movie) => movie.versions, {
    onDelete: 'CASCADE',
  })
  movie: Movie;
}
