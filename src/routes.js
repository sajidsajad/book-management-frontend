import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddBook from './pages/AddBook';
import EditBook from './pages/EditBook';
import BookDetails from './pages/BookDetails';
import AddReview from './pages/AddReview';
import EditReview from './pages/EditReview';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/add-book" element={<AddBook />} />
      <Route path="/edit-book/:bookId" element={<EditBook />} />
      <Route path="/books/:bookId" element={<BookDetails />} />
      <Route path="/books/:bookId/addReview" element={<AddReview />} />
      <Route path="/reviews/:bookId/editReview/:reviewId" element={<EditReview />} />
    </Routes>
  );
};

export default AppRoutes;
