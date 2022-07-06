import { Movie } from 'types/movie';
import { useEffect, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import { requestBackend } from 'util/request';

import './styles.css';

type Props = {
  movieId: string;
};

const MovieCardReview = ({ movieId }: Props) => {
  const [movie, setMovie] = useState<Movie>();

  useEffect(() => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/movies/${movieId}`,
      withCredentials: true,
    };

    requestBackend(config).then((response) => {
      setMovie(response.data);
    });
  }, [movieId]);

  return (
    <div className="movie-card">
      {movie ? (
        <div className="movie-card-review">
          <div className="movie-card-review-container-img">
            <img src={movie.imgUrl} alt={movie.title} />
          </div>
          <div className="movie-card-review-data">
            <h1 className="movie-card-review-title">{movie.title}</h1>
            <h2 className="movie-card-review-year">{movie.year}</h2>
            <p>{movie.subTitle ? movie.subTitle : '  '}</p>
            <div className="movie-card-review-synopsis">
              <p>{movie.synopsis}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Não foi encontrado...</p>
      )}
    </div>
  );
};

export default MovieCardReview;
