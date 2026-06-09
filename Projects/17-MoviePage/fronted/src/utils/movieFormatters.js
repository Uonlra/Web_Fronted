const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780"
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w185"

export const getMovieImage = (movie) => {
    const imagePath = movie?.backdrop_path || movie?.poster_path
    return imagePath ? `${IMAGE_BASE_URL}${imagePath}` : null
}

export const getMoviePoster = (movie) => {
    return movie?.poster_path ? `${POSTER_BASE_URL}${movie.poster_path}` : null
}

export const getReleaseYear = (movie) => movie?.release_date?.split("-")[0] || "2024"

export const getRating = (movie) => {
    const rating = Number(movie?.vote_average || 0)
    return rating ? rating.toFixed(1) : "8.0"
}
