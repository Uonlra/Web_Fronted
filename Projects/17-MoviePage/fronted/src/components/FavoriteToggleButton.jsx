function FavoriteToggleButton({ movie, favorite, onToggle, className = "" }) {
    return (
        <button
            type="button"
            className={`favorite-toggle ${favorite ? "active" : ""} ${className}`}
            aria-label={`${favorite ? "Remove" : "Add"} ${movie.title} ${favorite ? "from" : "to"} favorites`}
            aria-pressed={favorite}
            title={favorite ? "Remove from favorites" : "Add to favorites"}
            onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                onToggle(movie)
            }}
        >
            <span aria-hidden="true">{favorite ? "♥" : "♡"}</span>
        </button>
    )
}

export default FavoriteToggleButton
