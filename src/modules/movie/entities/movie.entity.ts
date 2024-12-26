import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { MovieVersion } from './movie.version.entity';

@Entity()
export class Movie {
  @PrimaryColumn('uuid', { default: () => 'gen_random_uuid()' })
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
