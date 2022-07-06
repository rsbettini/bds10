import { AxiosRequestConfig } from 'axios';
import ButtonIcon from 'components/ButtonIcon';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import StarImg from 'assets/images/star.png';
import { Reviews } from 'types/review';
import { BASE_URL, requestBackend } from 'util/request';
import MovieReviewsLoader from './MovieReviewsLoader';
import { hasAnyRoles } from 'util/auth';

import ReviewMovieCard from 'components/MovieCardReview';
import { toast } from 'react-toastify';

import './styles.css';

type UrlParams = {
  movieId: string;
};

type FormData = {
  text: string;
  movieId: string;
};

const MovieReviews = () => {
  const { movieId } = useParams<UrlParams>();
  const [addReview, setAddReview] = useState(false);
  const [reviewList, setReviewList] = useState<Reviews[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [haveList, setHaveList] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    const params: AxiosRequestConfig = {
      method: 'GET',
      url: `${BASE_URL}/movies/${movieId}/reviews`,
      withCredentials: true,
    };
    setIsLoading(true);
    requestBackend(params)
      .then((response) => {
        setReviewList(response.data);
      })
      .finally(() => {
        setIsLoading(false);
        setAddReview(false);
      });
  }, [addReview, movieId]);

  useEffect(() => {
    setHaveList(reviewList?.length ? reviewList.length : 0);
  }, [reviewList]);

  const onSubmit = (currentData: FormData) => {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: '/reviews',
      withCredentials: true,
      data: currentData,
    };
    requestBackend(config)
      .then((response) => {
        if (response.status === 201) {
          toast.success('Avaliação gravada com sucesso!');
          setAddReview(true);
          setValue('text', '');
        }
      })
      .catch(() => {
        toast.error('Erro ao tentar gravar sua avaliação...');
      });
  };

  return (
    <div className="movie-review-details-container">
      <div className="movie-review-all-container">
        <div className="movie-evaluation-title-container">
          <ReviewMovieCard movieId={movieId} />
        </div>

        {hasAnyRoles(['ROLE_MEMBER']) && (
          <div className="movie-evaluation-card">
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="hidden"
                {...register('movieId')}
                className={'form-control base-input'}
                name="movieId"
                value={movieId}
              />
              <div className="input-box movie-review-input-box">
                <input
                  {...register('text', {
                    required: 'Campo obrigatório',
                  })}
                  type="text"
                  className={`form-control base-input ${
                    errors.text ? 'Favor preencher a revisão' : ''
                  }`}
                  placeholder="Deixe sua avaliação aqui"
                  name="text"
                />
                <div className="invalid-feedback d-block">
                  {errors.text?.message}
                </div>
              </div>
              <div className="movie-evaluation-submit">
                <ButtonIcon text="Salvar Avaliação" />
              </div>
            </form>
          </div>
        )}

        <div className="base-card movie-row-reviews">
          {isLoading ? (
            <MovieReviewsLoader />
          ) : haveList > 0 ? (
            reviewList?.map((x) => (
              <div className="movie-row-details" key={x.id}>
                <div className="movie-row-details-title">
                  <img src={StarImg} alt="yellowStar" />
                  <h1>{x.user.name}</h1>
                </div>
                <div className="movie-row-description-evaluation">
                  <p>{x.text}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="movie-row-details-empty">
              <p>Sem Avaliações</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieReviews;
