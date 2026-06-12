import { useEffect } from "react"
import { useMovieDetailsModal } from "../Contexts/MovieDetailsModalContext"
import { MovieDetailsContent } from "../pages/MovieDetails"

function MovieDetailsModal() {
    const { selectedMovieId, closeMovieDetails } = useMovieDetailsModal()
    const isOpen = Boolean(selectedMovieId)

    useEffect(() => {
        if (!isOpen) {
            return undefined
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeMovieDetails()
            }
        }

        const originalBodyOverflow = document.body.style.overflow
        const originalHtmlOverflow = document.documentElement.style.overflow

        document.documentElement.style.overflow = "hidden"
        document.body.style.overflow = "hidden"
        window.addEventListener("keydown", handleKeyDown)

        return () => {
            document.documentElement.style.overflow = originalHtmlOverflow
            document.body.style.overflow = originalBodyOverflow
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [closeMovieDetails, isOpen])

    if (!isOpen) {
        return null
    }

    return (
        <div
            className="movie-details-modal"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    closeMovieDetails()
                }
            }}
        >
            <div
                className="movie-details-dialog"
                role="dialog"
                aria-modal="true"
                aria-label="Movie details"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <button
                    className="movie-details-close"
                    type="button"
                    aria-label="Close movie details"
                    onClick={closeMovieDetails}
                >
                    ×
                </button>
                <MovieDetailsContent
                    movieId={selectedMovieId}
                    onBack={closeMovieDetails}
                    backLabel="Close"
                />
            </div>
        </div>
    )
}

export default MovieDetailsModal
