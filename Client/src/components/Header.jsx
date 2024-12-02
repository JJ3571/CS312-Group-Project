import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('/api/currentUser', { withCredentials: true });
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        setError('An unexpected error occurred. Please try again.');
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout', {}, { withCredentials: true });
      setUser(null);
      navigate('/signin');
    } catch (error) {
      console.error('Error logging out:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <section id="header">
      {user ? (
        <>
          <span id="username">Welcome, {user.name}</span>
          <span id="profile">
            <a href="#">Manage Profile</a>
            <div className="dropdown">
              <a href="#">Account</a>
              <a href="#">History</a>
              <a href="#">Change Password</a>
            </div>
          </span>
          <span id="log">
            <a href="/Signin" onClick={handleLogout}>Sign Out</a>
          </span>
        </>
      ) : (
        <>
          <span id="username">Username</span>
          <span id="profile">
            <a href="#">Manage Profile</a>
          </span>
        </>
      )}
    </section>
  );
};

export default Header;