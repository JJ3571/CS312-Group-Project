import React from 'react';
import PropTypes from 'prop-types';

function Player({ track }) {
  console.log('Player Track:', track);

  return (
    <section id="player">
      <div id="cover"><img src="/data/cover/generic_album_cover.jpg" alt="Album cover" /></div>
      <div id="songinfo">
        <div id="title">{track.song_title}</div>
        <div id="album">{track.album_title}</div>
        <div id="artist">{track.artist_name}</div>
      </div>
      <div id="controls">
        <button id="back"></button>
        <audio controls>
          <source src={track.local_link_ref} type="audio/mpeg" />
        </audio>
        <button id="forward"></button>
      </div>
      <div id="rating">
        <form id="ratingForm">
          <label>1<br /><input type="radio" name="answer" value="1" required /></label>
          <label>2<br /><input type="radio" name="answer" value="2" required /></label>
          <label>3<br /><input type="radio" name="answer" value="3" required /></label>
          <label>4<br /><input type="radio" name="answer" value="4" required /></label>
          <label>5<br /><input type="radio" name="answer" value="5" required /></label>
        </form>
      </div>
    </section>
  );
}

Player.propTypes = {
  track: PropTypes.object.isRequired,
};

export default Player;