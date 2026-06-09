import { useEffect, useState } from "react"
import { MovieContext } from "./MovieContextCore"

const getStoredFavorites = () => {
    try {
        const storedFavs = localStorage.getItem("favorites")
        const parsedFavorites = storedFavs ? JSON.parse(storedFavs) : []

        return Array.isArray(parsedFavorites) ? parsedFavorites : []
    } catch {
        return []
    }
}

export const MovieProvider = ({children}) => {
    const [favorites, setFavorites] = useState(getStoredFavorites)

    useEffect(() => {
        try {
            localStorage.setItem('favorites', JSON.stringify(favorites))
        } catch {
            // Favorites remain available in memory when browser storage is unavailable.
        }
    }, [favorites])

    const addToFavorites = (movie) => {
        setFavorites(prev => {
            if (prev.some(favorite => favorite.id === movie.id)) {
                return prev
            }

            return [...prev, movie]
        })
    }

    const removeFromFavorites = (movieId) => {
        setFavorites(prev => prev.filter(movie => movie.id !== movieId))
    }
    
    const isFavorite = (movieId) => {
        return favorites.some(movie => movie.id === movieId)
    }

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    }

    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
}
