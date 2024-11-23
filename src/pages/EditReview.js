import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, TextField, Button, Box, Alert } from '@mui/material';

const EditReview = () => {
  const { reviewId, bookId } = useParams();
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState({ rating: '', comment: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/reviews/${bookId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviewData({
          rating: response.data.review.rating.toString(),
          comment: response.data.review.comment,
        });
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load review details.');
      }
    };

    fetchReview();
  }, [reviewId, bookId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData({ ...reviewData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/reviews/${reviewId}`,
        { rating: parseInt(reviewData.rating), comment: reviewData.comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Review updated successfully!');
      setTimeout(() => navigate(`/books/${bookId}`), 2000); // Go back to the previous page
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update review.');
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Review
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, margin: 'auto' }}>
        <TextField
          fullWidth
          label="Rating (1-5)"
          type="number"
          name="rating"
          value={reviewData.rating}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
          InputProps={{ inputMode: 'numeric', pattern: '[1-5]*' }}
          helperText="Please enter a rating between 1 and 5"
        />
        <TextField
          fullWidth
          label="Your Comment"
          name="comment"
          value={reviewData.comment}
          onChange={handleChange}
          required
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Update Review
        </Button>
      </Box>
    </Box>
  );
};

export default EditReview;
