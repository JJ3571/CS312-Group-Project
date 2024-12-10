import React from 'react';
import PropTypes from 'prop-types';
import '../style.css';

const Main = ({ songs, setCurrentSong }) => {
  console.log('Songs:', songs);

  return (
    <div id="main-content">
      <h1>Available Songs</h1>
      <ul>
        {songs.map((song) => (
          <li key={song.song_id} onClick={() => setCurrentSong(song)}>
            {song.song_title} by {song.artist_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

Main.propTypes = {
  songs: PropTypes.array.isRequired,
  setCurrentSong: PropTypes.func.isRequired,
};

export default Main;