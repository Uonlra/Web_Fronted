import { useEffect, useMemo, useState } from "react"
import { MovieContext } from "./MovieContextCore"

const readJson = (key, fallback) => {
    try {
        const storedValue = localStorage.getItem(key)
        return storedValue ? JSON.parse(storedValue) : fallback
    } catch {
        return fallback
    }
}

const hasStoredValue = (key) => {
    try {
        return localStorage.getItem(key) !== null
    } catch {
        return false
    }
}

const writeJson = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch {
        // Library state remains available in memory when browser storage is unavailable.
    }
}

const addMovieToLibrary = (library, movie, flags) => {
    if (!movie?.id) {
        return library
    }

    const currentEntry = library[movie.id] || {}

    return {
        ...library,
        [movie.id]: {
            movie: currentEntry.movie || movie,
            favorite: Boolean(currentEntry.favorite || flags.favorite),
            watchlist: Boolean(currentEntry.watchlist || flags.watchlist)
        }
    }
}

const normalizeLibrary = (library) => {
    if (!library || typeof library !== "object" || Array.isArray(library)) {
        return {}
    }

    return Object.entries(library).reduce((normalizedLibrary, [movieId, entry]) => {
        if (!entry?.movie?.id) {
            return normalizedLibrary
        }

        const favorite = Boolean(entry.favorite)
        const watchlist = Boolean(entry.watchlist)

        if (!favorite && !watchlist) {
            return normalizedLibrary
        }

        normalizedLibrary[movieId] = {
            movie: entry.movie,
            favorite,
            watchlist
        }

        return normalizedLibrary
    }, {})
}

const getStoredMovies = (key) => {
    const storedMovies = readJson(key, [])
    return Array.isArray(storedMovies) ? storedMovies : []
}

const getStoredLibrary = () => {
    const storedLibrary = normalizeLibrary(readJson("library", null))

    if (hasStoredValue("library")) {
        return storedLibrary
    }

    const favorites = getStoredMovies("favorites")
    const watchlist = getStoredMovies("watchlist")
    const migratedFavorites = favorites.reduce((library, movie) => {
        return addMovieToLibrary(library, movie, { favorite: true })
    }, {})

    return watchlist.reduce((library, movie) => {
        return addMovieToLibrary(library, movie, { watchlist: true })
    }, migratedFavorites)
}

const getLibraryMovies = (library, key) => {
    return Object.values(library)
        .filter((entry) => entry[key])
        .map((entry) => entry.movie)
}

const updateLibraryFlag = (movie, key, value) => (previousLibrary) => {
    if (!movie?.id) {
        return previousLibrary
    }

    const currentEntry = previousLibrary[movie.id] || {}

    return {
        ...previousLibrary,
        [movie.id]: {
            movie: currentEntry.movie || movie,
            favorite: Boolean(currentEntry.favorite),
            watchlist: Boolean(currentEntry.watchlist),
            [key]: value
        }
    }
}

const removeLibraryFlag = (movieId, key) => (previousLibrary) => {
    const currentEntry = previousLibrary[movieId]

    if (!currentEntry) {
        return previousLibrary
    }

    const nextEntry = {
        ...currentEntry,
        [key]: false
    }

    if (!nextEntry.favorite && !nextEntry.watchlist) {
        const { [movieId]: removedMovie, ...nextLibrary } = previousLibrary
        void removedMovie
        return nextLibrary
    }

    return {
        ...previousLibrary,
        [movieId]: nextEntry
    }
}

export const MovieProvider = ({children}) => {
    const [library, setLibrary] = useState(getStoredLibrary)

    useEffect(() => {
        writeJson("library", library)
    }, [library])

    const favorites = useMemo(() => getLibraryMovies(library, "favorite"), [library])
    const watchlist = useMemo(() => getLibraryMovies(library, "watchlist"), [library])

    const addToFavorites = (movie) => {
        setLibrary(updateLibraryFlag(movie, "favorite", true))
    }

    const removeFromFavorites = (movieId) => {
        setLibrary(removeLibraryFlag(movieId, "favorite"))
    }

    const isFavorite = (movieId) => {
        return Boolean(library[movieId]?.favorite)
    }

    const addToWatchlist = (movie) => {
        setLibrary(updateLibraryFlag(movie, "watchlist", true))
    }

    const removeFromWatchlist = (movieId) => {
        setLibrary(removeLibraryFlag(movieId, "watchlist"))
    }

    const isInWatchlist = (movieId) => {
        return Boolean(library[movieId]?.watchlist)
    }

    const value = {
        library,
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist
    }

    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
}
