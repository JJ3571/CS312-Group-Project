function Track (props) {
    return (
        <div className="track">
            <div className="trackGrid"><span className="title">{props.title}</span><span>{props.album}</span><span>{props.artist}</span><span>{props.time}</span><span>{props.rating}</span></div>        </div>
    );
}

export default Track;