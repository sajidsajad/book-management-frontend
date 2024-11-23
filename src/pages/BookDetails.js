import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Rating } from '@mui/material';
import { Box, Typography, Button, Card, CardContent, CardMedia, CircularProgress, Alert } from '@mui/material';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode

const BookDetails = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [severity, setSeverity] = useState(''); // 'success' or 'error'
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    // Decode the token and extract user ID
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id); // Assuming `id` is the field in your token
    }
  }, [token]);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/books/${bookId}`);
        setBook(response.data.book);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load book details.');
      }
    };

    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId, token]);

  const handleDelete = async () => {
    if (!token) {
      alert('You must be logged in to delete this book.');
      setSeverity('error');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Book deleted successfully!');
      setSeverity('success');
      setTimeout(() => {
        setMessage('');
        navigate('/'); // Redirect after showing the success message
      }, 2000); // 2-second delay
    } catch (err) {
        setMessage(err.response?.data?.error || 'Failed to delete book.');
        setSeverity('error');
    }
  };

  const handleEdit = () => {
    navigate(`/edit-book/${book.id}`);
  };

  const handleAddReview = () => {
    navigate(`/books/${bookId}/addReview`);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Update the reviews in the state after deletion
      setBook((prevBook) => ({
        ...prevBook,
        reviews: prevBook.reviews.filter((review) => review.id !== reviewId),
      }));
  
      setMessage('Review deleted successfully!');
      setSeverity('success');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to delete review.');
      setSeverity('error');
    }
  };
  

  if (!book) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      {error && <Alert severity="error">{error}</Alert>}
      {message && <Alert severity={severity}>{message}</Alert>}
      <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CardMedia
          component="img"
          sx={{ width: '500px', height: '300px', objectFit: 'cover', marginBottom: 2 }}
          image={book.coverImage}
          alt={book.title}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>Title: {book.title}</Typography>
          <Typography variant="h6" color="textSecondary">Author: {book.author}</Typography>
          <Typography variant="body1" color="textSecondary">Genre: {book.genre}</Typography>
          <Typography variant="body1" color="textSecondary">ISBN: {book.isbn}</Typography>
          <Typography variant="body1" color="textSecondary">
            Average Ratings: <Rating name="read-only" value={Number(book.averageRating) || 0} readOnly />
          </Typography>
        </CardContent>
      </Card>

      {/* Show buttons for Edit, Delete, and Add Review if logged in */}
      {token && userId === book.userId && (
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', marginTop: 2 }}>
            <Button variant="contained" sx={{backgroundColor: 'primary.main', color: 'white', '&:hover': {backgroundColor: 'primary.dark'}, borderRadius: 2, boxShadow: 2, padding: '10px 20px'}} onClick={handleEdit}>
                Edit
            </Button>

            <Button variant="contained" sx={{ backgroundColor: 'error.main', color: 'white', '&:hover': { backgroundColor: 'error.dark' }, borderRadius: 2, boxShadow: 2, padding: '10px 20px'}} onClick={handleDelete}>
                Delete
            </Button>
        </Box>
      )}

      {/* Show Add Review button only for logged-in users */}
      {token && userId !== book.userId && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <Button variant="contained" color="primary" onClick={handleAddReview}>
            Add Review
          </Button>
        </Box>
      )}

      {/* All Reviews with ratings */}
        <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5">Reviews</Typography>
        {book.reviews && book.reviews.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {book.reviews.map((review) => (
                <Box
                key={review.id}
                sx={{
                    width: { xs: '100%', sm: '48%', md: '30%' },
                    padding: 2,
                    backgroundColor: '#f0f0f0',
                    borderRadius: 2,
                }}
                >
                <Typography variant="body2" color="textSecondary">
                    Rating: <Rating name="read-only" value={Number(review.rating) || 0} readOnly />
                </Typography>
                <Typography variant="body1">{review.comment}</Typography>

                {/* Show Edit and Delete buttons only if the user owns the review */}
                {review.userId === userId && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/reviews/${book.id}/editReview/${review.id}`)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleDeleteReview(review.id)}
                    >
                        Delete
                    </Button>
                    </Box>
                )}
                </Box>
            ))}
            </Box>
        ) : (
            <Typography variant="body1" color="textSecondary">
            No reviews yet.
            </Typography>
        )}
        </Box>

    </Box>
  );
};

export default BookDetails;
