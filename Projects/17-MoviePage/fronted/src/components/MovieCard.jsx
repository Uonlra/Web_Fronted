
import '../css/MovieCard.css'

function MovieCard({ movie }) {

    function onFavoriteClick() {
        alert(`You favorited ${movie.title}!`)
    }

    return (
        <div className="movie-card">
            <div className="movie-poster">
                <img src={movie.posterUrl} alt={movie.title} />
            </div>
            <div className="movie-overlay">
                <button className="favorite-btn" onClick={onFavoriteClick}> 
                     ❤️
                </button >
            </div>
            <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-year">{movie.releaseDate}</p>
            </div>
        </div>
        
    )

}

export default MovieCard
