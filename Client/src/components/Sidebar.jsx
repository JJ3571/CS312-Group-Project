import React from 'react';
import axios from 'axios';

function Sidebar() {
  const handleSearch = async () => {
    const query = prompt('Enter search query:');
    if (query) {
      try {
        const response = await axios.get(`/api/search?query=${query}`, { withCredentials: true });
        console.log('Search results:', response.data.songs);
      } catch (error) {
        console.error('Error searching for songs:', error);
      }
    }
  };

  const handlePlaylists = async () => {
    try {
      const response = await axios.get('/api/playlists', { withCredentials: true });
      console.log('Playlists:', response.data.playlists);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const handleGenre = async () => {
    const genre = prompt('Enter genre:');
    if (genre) {
      try {
        const response = await axios.get(`/api/genre?genre=${genre}`, { withCredentials: true });
        console.log('Songs by genre:', response.data.songs);
      } catch (error) {
        console.error('Error fetching songs by genre:', error);
      }
    }
  };

  const handleMood = async () => {
    const mood = prompt('Enter mood:');
    if (mood) {
      try {
        const response = await axios.get(`/api/mood?mood=${mood}`, { withCredentials: true });
        console.log('Songs by mood:', response.data.songs);
      } catch (error) {
        console.error('Error fetching songs by mood:', error);
      }
    }
  };

  const handleHistory = async () => {
    try {
      const response = await axios.get('/api/history', { withCredentials: true });
      console.log('Listening history:', response.data.history);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  return (
    <section id="sidebar">
      <div id="logo"><img alt=""/></div>
      <div id="nav">
        <div className="button" id="search" onClick={handleSearch}>Search</div>
        <div className="button" id="playlists" onClick={handlePlaylists}>Playlists</div>
        <div className="button" id="genre" onClick={handleGenre}>Genre</div>
        <div className="button" id="mood" onClick={handleMood}>Mood</div>
        <div className="button" id="history" onClick={handleHistory}>History</div>
      </div>
    </section>
  );
}

export default Sidebar;