import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import axios from 'axios';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [apiError, setApiError] = useState(''); // State to hold server error messages

  const onSubmit = async (data) => {
    try {
        setApiError(''); // Reset error before submitting
        const response = await axios.post('http://localhost:5000/api/users/register', data);
        console.log('Register successful:', response.data);

        // Redirect to login page
        window.location.href = '/login';
    } catch (err) {
      console.error('Register failed:', err.response?.data || err.message);
      setApiError(err.response?.data?.message || 'An error occurred during signup');
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
      <Typography variant="h4" gutterBottom>Register</Typography>
      {apiError && <Alert severity="error" sx={{ width: '100%', maxWidth: 400 }}>{apiError}</Alert>}
      <Box
        component="form"
        sx={{ width: '100%', maxWidth: 400 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          {...register('username', { required: 'UserName is required' })}
          label="UserName"
          fullWidth
          margin="normal"
          error={!!errors.username}
          helperText={errors.username?.message}
        />
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
          {...register('password', { 
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters long',
            },
          })}
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
          Signup
        </Button>
      </Box>
    </Box>
  );

};

export default Register;
