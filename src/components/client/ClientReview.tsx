import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchReviews } from '../../store/slices/reviewsSlice';
import { ReviewResponseDto } from '../../types/review';

const ClientReviews: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const reviews = useSelector((state: RootState) => state.reviews.clientReviews);

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  return (
    <div>
      <h2>Мои отзывы</h2>
      {reviews.length === 0 ? (
        <p>Вы еще не оставили ни одного отзыва.</p>
      ) : (
        <ul>
          {reviews.map((review: ReviewResponseDto) => (
            <li key={review.id}>
              {review.specialistName} - Оценка: {review.rating}
              <p>{review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientReviews;