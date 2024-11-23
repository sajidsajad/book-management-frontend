import React from 'react';
import { Typography, Box, Card, CardContent, CardMedia, Rating } from '@mui/material';

const BookCard = ({ book }) => {
  return (
    <Card key={book.id} sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                height="140"
                image={book.coverImage} // Display book cover image
                alt={book.title}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {book.title}
                </Typography>
                {/* <Typography variant="body2" color="text.secondary">
                  {book.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ISBN: {book.isbn}
                </Typography> */}
                {/* Display average rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                  <Rating name="read-only" value={Number(book.ratings) || 0} readOnly />
                  <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                  {/* {book.ratings ? (parseFloat(book.ratings) % 1 === 0 ? parseInt(book.ratings) : parseFloat(book.ratings).toFixed(1)) : 'No ratings yet'} */}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
  );
};

export default BookCard;
