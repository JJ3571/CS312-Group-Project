function Player (props) {
    return (
        <section id="player">
            <div id="cover"><img src="folktronica.png" alt="Album cover"/></div>
            <div id="songinfo">
                <div id="title">{props.track.title}</div>
                <div id="album">Album</div>
                <div id="artist">Artist</div>
            </div>
            <div id="controls">
                <button id="back"></button>
                <audio controls><source src={`../../public/data/mp3+${props.track.local_link_ref}`} type="audio/mpeg" /></audio>
                <button id="forward"></button>
            </div>
            <div id="rating">
                <form id="ratingForm">
                    <label>1<br/><input type="radio" name="answer" value="1" required /></label>
                    <label>2<br/><input type="radio" name="answer"  value="2" required /></label>
                    <label>3<br/><input type="radio" name="answer" value="3" required /></label>
                    <label>4<br/><input type="radio" name="answer" value="4" required /></label>
                    <label>5<br/><input type="radio" name="answer" value="5" required /></label>
                </form>
            </div>
        </section>
    );
}


export default Player;