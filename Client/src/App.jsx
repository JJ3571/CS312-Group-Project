import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signin from './components/Signin.jsx';
import Signup from './components/Signup.jsx';
import Home from './components/Home.jsx';
import axios from 'axios';

const App = () => {
  const [user, setUser] = useState(null);

  // Fetches the current user on app load
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/api/currentUser', { withCredentials: true });
      if (response.status === 200 && response.data.success) {
        setUser(response.data.user);
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={user ? <Navigate to="/home" /> : <Signin setUser={setUser} />} />
        <Route path="/signup" element={user ? <Navigate to="/home" /> : <Signup />} />
        <Route path="/home" element={user ? <Home user={user} /> : <Navigate to="/signin" />} />
        <Route path="*" element={<Navigate to={user ? "/home" : "/signin"} />} />
      </Routes>
    </Router>
  );
};

export default App;