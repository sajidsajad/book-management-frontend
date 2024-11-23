import React from 'react';
import AppRoutes from './routes';
import Navbar from './components/Navbar'; // Navbar component (for login/logout)

const App = () => {
  return (
    <div>
      <Navbar />
      <AppRoutes />
    </div>
  );
};

export default App;
