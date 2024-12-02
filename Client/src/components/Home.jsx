import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
// Page Components
import Header from './Header';
import Sidebar from './Sidebar';
import Main from './Main';
import Player from './Player';

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

  // const to replace current song with after DB is updated:
  // const currentSong = songs.length > 0 ? songs[0] : null;

  const currentSong = { // test song (this should be replaced with a song fetched from the SQL table)
    song_title: "Testsong #1",
    song_id: 1,
    local_link_ref: "",
    artist_id: 1,
    album_id: 1,
    release_date: 2024
  };

  return (
    <div id="body">
      <Header />
      <Sidebar />
      <Main />
      <Player track={currentSong}/>
    </div>
  );
};

Home.propTypes = {
  user: PropTypes.object,
};

export default Home;