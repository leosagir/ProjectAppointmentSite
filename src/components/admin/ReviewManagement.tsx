import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchReviews, updateReview, deleteReview } from '../../store/slices/reviewsSlice';
import { ReviewResponseDto, ReviewUpdateDto } from '../../types/review';
import styles from './ReviewManagement.module.css';

const ReviewManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const reviews = useSelector((state: RootState) => state.reviews.reviews);
  const [selectedReview, setSelectedReview] = useState<ReviewResponseDto | null>(null);
  const [formData, setFormData] = useState<ReviewUpdateDto>({
    rating: 0,
    comment: '',
  });

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedReview) {
      dispatch(updateReview({ id: selectedReview.id, data: formData }));
    }
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      dispatch(deleteReview(id));
    }
  };

  const resetForm = () => {
    setSelectedReview(null);
    setFormData({
      rating: 0,
      comment: '',
    });
  };

  return (
    <div className={styles.reviewManagement}>
      <h2>Управление отзывами</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="number"
          name="rating"
          value={formData.rating}
          onChange={handleInputChange}
          placeholder="Рейтинг"
          min="1"
          max="5"
          required
        />
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleInputChange}
          placeholder="Комментарий"
          required
        />
        <button type="submit">Обновить</button>
        <button type="button" onClick={resetForm}>Отмена</button>
      </form>
      <ul className={styles.reviewList}>
        {reviews.map((review) => (
          <li key={review.id} className={styles.reviewItem}>
            <span>{review.clientName} - Рейтинг: {review.rating}</span>
            <p>{review.comment}</p>
            <div>
              <button onClick={() => setSelectedReview(review)}>Редактировать</button>
              <button onClick={() => handleDelete(review.id)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewManagement;