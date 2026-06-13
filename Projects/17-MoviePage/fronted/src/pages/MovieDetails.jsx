import { useNavigate, useParams } from "react-router-dom"
import MovieDetailsContent from "../components/MovieDetailsContent"

function MovieDetails() {
    const { movieId } = useParams()
    const navigate = useNavigate()

    return (
        <MovieDetailsContent
            movieId={movieId}
            onBack={() => navigate("/movies")}
            backLabel="Back to Movies"
        />
    )
}

export default MovieDetails
