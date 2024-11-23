// src/components/Navbar.js

import React from 'react';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom'; // For navigation

const Navbar = () => {
  const isAuthenticated = localStorage.getItem('authToken'); // Check if the user is authenticated

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/'; // Redirect to login page
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#15B392' }}>
      <Toolbar>
        <Typography component={Link} to="/" style={{ textDecoration: 'none', color: 'inherit' }} variant="h6" sx={{ flexGrow: 1 }}>
          Book Management
        </Typography>

        <Box sx={{ display: 'flex' }}>
          {/* Show login/signup buttons when not authenticated */}
          {!isAuthenticated ? (
            <>
                <Button component={Link} to="/login" sx={{ marginRight: '10px',backgroundColor: 'primary.main', color: 'white', '&:hover': { backgroundColor: 'primary.dark', },    borderRadius: 2, boxShadow: 2, }}>
                    Login
                </Button>

                <Button component={Link} to="/register" sx={{backgroundColor:'secondary.main',    color: 'white','&:hover': { backgroundColor: 'secondary.dark', }, borderRadius:2, boxShadow: 2,}}>
                    Sign Up
                </Button>
            </>
          ) : (
            <>
                <Button component={Link} to="/add-book" sx={{ marginRight: '10px',backgroundColor: 'success.main', color: 'white', '&:hover': {     backgroundColor: 'success.dark',}, borderRadius: 2, boxShadow: 2,}}>
                    Add Book
                </Button>

                <Button onClick={handleLogout} sx={{ backgroundColor: 'error.main',color: 'white','&:hover': { backgroundColor: 'error.dark',}, borderRadius: 2, boxShadow: 2,}}>
                    Logout
                </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
