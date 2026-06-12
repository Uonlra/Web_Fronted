import { createContext, useContext } from "react"

export const MovieDetailsModalContext = createContext(null)

export const useMovieDetailsModal = () => {
    const context = useContext(MovieDetailsModalContext)

    if (!context) {
        throw new Error("useMovieDetailsModal must be used within a MovieDetailsModalProvider")
    }

    return context
}
