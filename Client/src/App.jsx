import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signin from './components/Signin.jsx';
import Signup from './components/Signup.jsx';
import Home from './components/Home.jsx';
import axios from 'axios';

const App = () => {
  const [user, setUser] = useState(null);

  // fetches the current user on app load. Need to add handle for not logged in => signin 
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('/api/currentUser', { withCredentials: true });
        if (response.data.success) {
          console.log('Fetched User:', response.data.user);
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
        setUser(null);
      }
    };
  
    fetchCurrentUser();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={user ? <Navigate to="/home" /> : <Signin setUser={setUser} />} />
        <Route path="/signup" element={user ? <Navigate to="/home" /> : <Signup />} />
        <Route path="/home" element={user ? <Home user={user} /> : <Navigate to="/signin" />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
};

export default App;