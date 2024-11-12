import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

const Home = ({ user }) => {
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState('');

  const fetchSongs = async () => {
    try {
      const response = await axios.get('/api/music', { withCredentials: true });
      console.log('Fetched Songs:', response.data.songs);
      if (response.data.success === false) {
        setError(response.data.message || 'Failed to fetch songs.');
      } else {
        setSongs(response.data.songs);
      }
    } catch (err) {
      console.error('Error fetching songs:', err);
      setError('An error occurred while fetching songs.');
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleLogout = async () => {
    const response = await axios.post('/api/logout', { withCredentials: true });
    window.location.reload();
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <h1>Welcome {user ? user.name : 'Guest'}!</h1>
      <h2>Music Placeholder:</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

Home.propTypes = {
  user: PropTypes.object,
};

export default Home;