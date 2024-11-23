import React, { useEffect, useState } from 'react';
import { Typography, Box, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';
import BookCard from '../components/BookCard';
import { Link } from 'react-router-dom';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState(''); // State to hold search query
  const [error, setError] = useState(''); // State to hold any error message
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Fetch books from the backend API
  const fetchBooks = async (searchQuery = '') => {
    setIsLoading(true);
    try {
      let response;
      if (searchQuery) {
        // Search for books if a query exists
        response = await axios.get('http://localhost:5000/api/books/search', {
          params: { query: searchQuery }, // Pass query in the params
        });
      } else {
        // Fetch all books if no query
        response = await axios.get('http://localhost:5000/api/books');
      }
      
      setBooks(response.data.books); // Update books state with fetched books
      setError(''); // Clear any previous error
    } catch (err) {
      setError('Failed to fetch books.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all books when the component loads
  useEffect(() => {
    fetchBooks(); // Fetch all books initially
  }, []);

  // Handle search query change
  const handleSearchChange = (e) => {
    setQuery(e.target.value); // Update query state as user types
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBooks(query); // Fetch books based on query (or all if empty)
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: 3, position: 'relative' }}>
      {/* Welcome message */}
      <Typography variant="h4" gutterBottom align="center">
        Welcome to the Book Management App
      </Typography>

      {/* Search bar */}
      <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <TextField
          label="Search for books by title, author, or ISBN"
          variant="outlined"
          value={query}
          onChange={handleSearchChange}
          sx={{ mr: 2, minWidth: '300px' }}
        />
        <Button variant="contained" color="primary" type="submit" sx={{ height: '100%' }}>
          Search
        </Button>
      </Box>

      {/* Error handling */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Loading indicator */}
      {isLoading && <Typography variant="body1" align="center">Loading...</Typography>}

      {/* Display books */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 3,
          justifyContent: 'center',
        }}
      >
        {books.length > 0 ? (
          books.map((book) => (
            <Link key={book.id} to={`/books/${book.id}`} style={{ textDecoration: 'none' }}>
              <BookCard book={book} />
            </Link>
          ))
        ) : (
          <Typography variant="h6" color="text.secondary" align="center">
            {query ? 'No books found for your search query.' : 'No books available.'}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Home;
