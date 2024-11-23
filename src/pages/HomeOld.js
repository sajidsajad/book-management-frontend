import React, { useEffect, useState } from 'react';
import { Typography, Box, TextField, Button, Alert } from '@mui/material';
// import { useNavigate } from 'react-router-dom'; // For navigation
import axios from 'axios';
import BookCard from '../components/BookCard';
import { Link } from 'react-router-dom'; // For navigation


const Home = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState(''); // State to hold search query
  const [error, setError] = useState(''); // State to hold any error message
  const [isLoading, setIsLoading] = useState(false); // Loading state
//   const navigate = useNavigate();

     // Fetch books from the backend API
  const fetchBooks = async (searchQuery = '') => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/books', {
        params: {
          query: searchQuery, // Pass query if searching
        },
      });
      setBooks(response.data.books); // Update books state with fetched books
      setError(''); // Clear any previous error
    } catch (err) {
      setError('Failed to fetch books.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if token exists in localStorage when the component mounts
  useEffect(() => {
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   setIsAuthenticated(true); // User is logged in
      fetchBooks(); // Fetch books if authenticated
    // } else {
    //   setIsAuthenticated(false); // User is not logged in
    // }
  }, []);

  // Handle search query change
  const handleSearchChange = (e) => {
    setQuery(e.target.value); // Update query state as user types
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBooks(query); // Fetch books based on query
  };

  // Fetch books from the backend API
//   const fetchBooks = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/books', {
//         // headers: { Authorization: `Bearer ${token}` }
//       });
//       setBooks(response.data.books); // Store books data
//       console.log(response.data.books);
//     } catch (err) {
//       console.error('Failed to fetch books:', err);
//     }
//   };

  // Handle Logout
//   const handleLogout = () => {
//     localStorage.removeItem('authToken'); // Remove token from localStorage
//     setIsAuthenticated(false); // Update state
//     navigate('/login'); // Redirect to login page
//   };

//   return (
//     <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: 3, position: 'relative' }}>
      

//       {/* Welcome message */}
//       <Typography variant="h4" gutterBottom align="center">
//         Welcome to the Book Management App
//       </Typography>

//       {/* Display books in a grid layout using Box */}
//       <Box
//         sx={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
//           gap: 3,
//           justifyContent: 'center',
//         }}
//       >
        
//         {books.length > 0 ? (
//           books.map((book) => (
//             <Link key={book.id} to={`/books/${book.id}`} style={{ textDecoration: 'none' }}>
//             <BookCard book={book} />
//           </Link>
//           ))
//         ) : (
//           <Typography variant="h6" color="text.secondary" align="center">
//             No books available. Please log in to view books.
//           </Typography>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default Home;

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
          sx={{ mr: 2, minWidth: '200px' }}
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
            No books found. Try searching again.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Home;
