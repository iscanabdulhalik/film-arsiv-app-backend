import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { MovieVersion } from './movie.version.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @OneToMany(() => MovieVersion, (version) => version.movie, {
    cascade: true,
  })
  versions: MovieVersion[];
}
