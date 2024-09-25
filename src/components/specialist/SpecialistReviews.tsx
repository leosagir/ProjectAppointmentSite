import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchReviews } from '../../store/slices/reviewsSlice';
import { ReviewResponseDto } from '../../types/review';

const SpecialistReviews: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const reviews = useSelector((state: RootState) => state.reviews.specialistReviews);

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  return (
    <div>
      <h2>Отзывы обо мне</h2>
      {reviews.length === 0 ? (
        <p>У вас пока нет отзывов.</p>
      ) : (
        <ul>
          {reviews.map((review: ReviewResponseDto) => (
            <li key={review.id}>
              {review.clientName} - Оценка: {review.rating}
              <p>{review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SpecialistReviews;