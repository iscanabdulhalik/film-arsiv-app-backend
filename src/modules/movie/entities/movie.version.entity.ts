import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Movie } from './movie.entity';

@Entity()
export class MovieVersion {
  @PrimaryGeneratedColumn('uuid')
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
