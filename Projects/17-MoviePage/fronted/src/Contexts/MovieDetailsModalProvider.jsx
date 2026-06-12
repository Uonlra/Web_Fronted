import { useCallback, useMemo, useState } from "react"
import { MovieDetailsModalContext } from "./MovieDetailsModalContext"

export function MovieDetailsModalProvider({ children }) {
    const [selectedMovieId, setSelectedMovieId] = useState(null)

    const openMovieDetails = useCallback((movieId) => {
        if (!movieId) {
            return
        }

        setSelectedMovieId(movieId)
    }, [])

    const closeMovieDetails = useCallback(() => {
        setSelectedMovieId(null)
    }, [])

    const value = useMemo(() => ({
        selectedMovieId,
        openMovieDetails,
        closeMovieDetails
    }), [closeMovieDetails, openMovieDetails, selectedMovieId])

    return (
        <MovieDetailsModalContext.Provider value={value}>
            {children}
        </MovieDetailsModalContext.Provider>
    )
}
