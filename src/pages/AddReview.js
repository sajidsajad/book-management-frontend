import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, Box, TextField, Button, Alert } from '@mui/material';

const AddReview = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [reviewData, setReviewData] = useState({
    rating: '',
    comment: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const token = localStorage.getItem('authToken');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData({ ...reviewData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setInfoMessage('');

    if (!reviewData.rating || !reviewData.comment) {
      setError('Rating and comment are required.');
      return;
    }

    if (reviewData.rating < 1 || reviewData.rating > 5) {
        setError('Rating must be in range of 1-5.');
        return;
      }

    try {
      const payload = {
        bookId: parseInt(bookId), // Ensure bookId is a number
        rating: parseInt(reviewData.rating), // Ensure rating is a number
        comment: reviewData.comment, // Ensure comment is a string
      };

      const response = await axios.post(
        'http://localhost:5000/api/reviews',
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200 && response.data.review) {
        // If review exists, inform the user and prefill the form
        setInfoMessage(response.data.message);
        setReviewData({
            rating: '',
            comment: '',
          });
          setTimeout(() => navigate(`/reviews/${bookId}/editReview/${response.data.review.id}`), 2000);  // Redirect after showing the success message

      } else {
        // If the review was successfully added
        setSuccess(response.data.message || 'Review submitted successfully!');
        setTimeout(() => navigate(`/books/${bookId}`), 2000); // Redirect after success
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review.');
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Add Your Review
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      {infoMessage && <Alert severity="info">{infoMessage}</Alert>}

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
          InputProps={{
            inputMode: 'numeric',
            pattern: '[1-5]*',
          }}
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
          {infoMessage ? 'Update Review' : 'Submit Review'}
        </Button>
      </Box>
    </Box>
  );
};

export default AddReview;
