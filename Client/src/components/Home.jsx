import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
// Page Components
import Header from './Header';
import Sidebar from './Sidebar';
import Main from './Main';
import Player from './Player';

const Home = ({ user }) => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [error, setError] = useState('');

  const fetchSongs = async () => {
    try {
      const response = await axios.get('/api/music', { withCredentials: true });
      console.log('Fetched Songs:', response.data.songs);
      if (response.data.success === false) {
        setError(response.data.message || 'Failed to fetch songs.');
      } else {
        setSongs(response.data.songs);
        if (response.data.songs.length > 0) {
          setCurrentSong(response.data.songs[0]); // Set the first song as the current song
        }
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

  console.log('Current Song:', currentSong);

  return (
    <div id="homepage-body">
      <Header />
      <Sidebar />
      <Main songs={songs} setCurrentSong={setCurrentSong} />
      {currentSong && <Player track={currentSong} />}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

Home.propTypes = {
  user: PropTypes.object,
};

export default Home;