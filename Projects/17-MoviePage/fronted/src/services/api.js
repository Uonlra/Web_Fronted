const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

const createTmdbUrl = (endpoint, params = {}) => {
    if (!API_KEY) {
        throw new Error("Missing TMDB API key. Add VITE_TMDB_API_KEY to your .env file.")
    }

    const url = new URL(`${BASE_URL}${endpoint}`)
    url.searchParams.set("api_key", API_KEY)

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            url.searchParams.set(key, value)
        }
    })

    return url
}

const requestTmdb = async (endpoint, params) => {
    const url = createTmdbUrl(endpoint, params)

    let response

    try {
        response = await fetch(url)
    } catch {
        throw new Error("Unable to reach TMDB. Check your connection and try again.")
    }

    let data

    try {
        data = await response.json()
    } catch {
        throw new Error("TMDB returned an unreadable response.")
    }

    if (!response.ok) {
        throw new Error(data.status_message || `TMDB request failed with status ${response.status}.`)
    }

    return data
}

const requestMovies = async (endpoint, params) => {
    const data = await requestTmdb(endpoint, params)

    if (!Array.isArray(data.results)) {
        throw new Error("TMDB response did not include a movie list.")
    }

    return data.results
}

const requestMoviePage = async (endpoint, params) => {
    const data = await requestTmdb(endpoint, params)

    if (!Array.isArray(data.results)) {
        throw new Error("TMDB response did not include a movie list.")
    }

    return {
        movies: data.results,
        page: data.page || 1,
        totalPages: data.total_pages || 1,
        totalResults: data.total_results || data.results.length
    }
}

export const getPopularMovies = (params = {}) => {
    return requestMovies("/movie/popular", params)
}

export const getTrendingMovies = () => {
    return requestMovies("/trending/movie/week")
}

export const getNowPlayingMovies = () => {
    return requestMovies("/movie/now_playing")
}

export const getTopRatedMovies = () => {
    return requestMovies("/movie/top_rated")
}

export const searchMovies = (query, params = {}) => {
    return requestMovies("/search/movie", { query, ...params })
}

export const getMovieDetails = (movieId) => {
    return requestTmdb(`/movie/${movieId}`)
}

export const discoverMovies = (params = {}) => {
    return requestMoviePage("/discover/movie", {
        include_adult: false,
        include_video: false,
        language: "en-US",
        ...params
    })
}

export const searchMoviePage = (query, params = {}) => {
    return requestMoviePage("/search/movie", {
        include_adult: false,
        language: "en-US",
        query,
        ...params
    })
}
