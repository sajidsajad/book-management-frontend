import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';

const AddBook = () => {
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    coverImage: null,
  });
  const [imagePreview, setImagePreview] = useState(''); // For image preview
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  
  const resetForm = () => {
    setBookData({
      title: '',
      author: '',
      genre: '',
      isbn: '',
      coverImage: null,
    });
    setImagePreview(''); // Clear preview
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setBookData({ ...bookData, coverImage: file });
    setImagePreview(URL.createObjectURL(file)); // Generate and set preview URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You must be logged in to add a book.');
      resetForm();
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', bookData.title);
      formData.append('author', bookData.author);
      formData.append('genre', bookData.genre);
      formData.append('isbn', bookData.isbn);
      formData.append('coverImage', bookData.coverImage);

      const response = await axios.post('http://localhost:5000/api/books', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
      setSuccess('Book added successfully!');
      setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add book.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 500, margin: 'auto', mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}
    >
      <Typography variant="h4" gutterBottom>
        Add a New Book
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
        Upload Cover Image
        <input type="file" hidden onChange={handleFileChange} />
      </Button>
      {/* Display the image preview if available */}
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Cover Preview"
          style={{ width: '200px', marginBottom: '10px', borderRadius: '5px' }}
        />
      )}
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Add Book
      </Button>
    </Box>
  );
};

export default AddBook;
