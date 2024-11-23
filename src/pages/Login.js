import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginError, setLoginError] = useState(''); // State for login errors

  const onSubmit = async (data) => {
    try {
      setLoginError(''); // Reset error message before attempting login
      const response = await axios.post('http://localhost:5000/api/users/login', data);
      const { token } = response.data;

      // Store token in localStorage
      localStorage.setItem('authToken', token);
      console.log('Logged in successfully:', token);

      // Redirect to another page (e.g., Dashboard)
      window.location.href = '/';
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      setLoginError(err.response?.data?.message || 'An error occurred during login: cross check your credentials!');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: 3,
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography variant="h4" gutterBottom>Login</Typography>
      {loginError && (
        <Alert severity="error" sx={{ width: '100%', maxWidth: 400, marginBottom: 2 }}>
          {loginError}
        </Alert>
      )}
      <Box
        component="form"
        sx={{ width: '100%', maxWidth: 400 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Enter a valid email address',
            },
          })}
          label="Email"
          fullWidth
          margin="normal"
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          {...register('password', { required: 'Password is required' })}
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
