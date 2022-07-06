import { Movie } from 'types/movie';

import './styles.css';

type Props = {
  movie: Movie;
};

const MovieListCard = ({ movie }: Props) => {
  return (
    <div className="movie-list-card">
      <div className="movie-list-card-img">
        <img src={movie.imgUrl} alt={movie.title} />
      </div>
      <div className="movie-list-card-data">
        <h1 className="movie-list-card-title">{movie.title}</h1>
        <h2 className="movie-list-card-year">{movie.year}</h2>
        <p className="movie-list-card-subtitle">
          {movie.subTitle ? movie.subTitle : '  '}
        </p>
      </div>
    </div>
  );
};

export default MovieListCard;
