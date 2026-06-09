import { createContext, useContext } from "react"

export const MovieContext = createContext(null)

export const useMovieContext = () => {
    const context = useContext(MovieContext)

    if (!context) {
        throw new Error("useMovieContext must be used within a MovieProvider")
    }

    return context
}
