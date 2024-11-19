import Track from "./Track"


function Playlist (props) {
    return(
        <div className="album">
            <div id="albumHeader">
                <img src="../../public/data/cover/profilepic.jpg" alt="" />
                <div>
                    <h1>{props.album.albumTitle}</h1>
                    <h2>{props.album.albumArtist}</h2>
                    <h2>{props.album.releaseDate}</h2>
                </div>
            </div>
            <div id="columnLabels">
                <div className="trackGrid"><span className="title">Title</span><span>Album</span><span>Artist</span><span>MM:SS</span><span>Rating</span></div>
            </div>
            {props.album.tracks.map((track) => {
                return <Track title={track.title} album={track.album} artist={track.artist} time={track.time} rating={track.rating}/>
            })}
            
            
        </div>
    );
}

export default Playlist;