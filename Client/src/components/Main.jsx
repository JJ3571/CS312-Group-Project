import Playlist from './Playlist';

const testAlbum = { // This is just a test 
    albumTitle: "Album Name",
    albumArtist: "Prestune",
    releaseDate: "January 1, 2010",
    albumCover: "./profilepic.png",
    tracks: [
    {
        title: "Track 1",
        album: "AlbumName",
        artist: "Prestune",
        time: "03:00",
        rating: "5.0"
    },
    {
        title: "Track 1",
        album: "AlbumName",
        artist: "Prestune",
        time: "03:00",
        rating: "5.0"
    },
    {
        title: "Track 1",
        album: "AlbumName",
        artist: "Prestune",
        time: "03:00",
        rating: "5.0"
    },
    {
        title: "Track 1",
        album: "AlbumName",
        artist: "Prestune",
        time: "03:00",
        rating: "5.0"
    },
    {
        title: "Track 1",
        album: "AlbumName",
        artist: "Prestune",
        time: "03:00",
        rating: "5.0"
    },
    {
        title: "Track 1",
        album: "AlbumName",
        artist: "Prestune",
        time: "03:00",
        rating: "5.0"
    },
    {
        title: "Track 1",
        album: "AlbumName",
        artist: "Prestune",
        time: "03:00",
        rating: "5.0"
    },
    {
        title: "Track 1",
        album: "AlbumName",
        artist: "Prestune",
        time: "03:00",
        rating: "5.0"
    },
    {
        title: "Track 1",
        album: "AlbumName",
        artist: "Prestune",
        time: "03:00",
        rating: "5.0"
    },
    {
        title: "Track 1",
        album: "AlbumName",
        artist: "Prestune",
        time: "03:00",
        rating: "5.0"
    },
    {
        title: "Track 1",
        album: "AlbumName",
        artist: "Prestune",
        time: "03:00",
        rating: "5.0"
    }]
};

function Main () {
    return (
        <section id="main">
            <Playlist album={testAlbum}/>
        </section>
    );
}

export default Main;