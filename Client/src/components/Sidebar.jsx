function Sidebar () {
    return (
        <section id="sidebar">
            <div id="logo"><img alt=""/></div>
            <div id="nav">
                <div className="button" id="search">Search</div>
                <div className="button" id="playlists">Playlists</div>
                <div className="button" id="mood">Genre</div>
                <div className="button" id="mood">Mood</div>
                <div className="button" id="history">History</div>
            </div>
        </section>
    );
}


export default Sidebar;