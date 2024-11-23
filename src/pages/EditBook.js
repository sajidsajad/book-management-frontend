import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';

const EditBook = () => {
  const { bookId } = useParams(); // Get book ID from the URL
  const navigate = useNavigate();

  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    coverImage: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(''); // For existing/new image preview

  const resetForm = () => {
    setBookData({
      title: '',
      author: '',
      genre: '',
      isbn: '',
      coverImage: null,
    });
  };

  // Fetch book details on component mount
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/books/${bookId}`);
        const { title, author, genre, isbn, coverImage } = response.data.book;
        setBookData({ title, author, genre, isbn });
        setImagePreview(coverImage); // Set the existing image as preview
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch book details.');
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setBookData({ ...bookData, coverImage: file });
    setImagePreview(URL.createObjectURL(file)); // Update preview with new image
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You must be logged in to update the book.');
      resetForm();
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', bookData.title);
      formData.append('author', bookData.author);
      formData.append('genre', bookData.genre);
      formData.append('isbn', bookData.isbn);

      // Only add coverImage if a new one is uploaded
      if (bookData.coverImage) {
        formData.append('coverImage', bookData.coverImage);
      }

      await axios.put(`http://localhost:5000/api/books/${bookId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Book updated successfully!');
      setTimeout(() => navigate(`/books/${bookId}`), 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update the book.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 500, margin: 'auto', mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}
    >
      <Typography variant="h4" gutterBottom>
        Edit Book
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <TextField
        fullWidth
        label="Title"
        name="title"
        value={bookData.title}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Author"
        name="author"
        value={bookData.author}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Genre"
        name="genre"
        value={bookData.genre}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="ISBN"
        name="isbn"
        value={bookData.isbn}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
      />
      <Button variant="contained" component="label" sx={{ mb: 2 }}>
        Upload New Cover Image
        <input type="file" hidden onChange={handleFileChange} />
      </Button>
      {/* Show the existing/new image preview */}
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Cover Preview"
          style={{ width: '200px', marginTop: '10px', borderRadius: '5px' }}
        />
      )}
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Update Book
      </Button>
    </Box>
  );
};

export default EditBook;
