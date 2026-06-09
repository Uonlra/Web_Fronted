import MovieCard from "../components/MovieCard"
import { useEffect, useState } from 'react'
import { searchMovies, getPopularMovies } from "../services/api"
import '../css/Home.css'

function Home() {
    
    const [searchQuery, setSearchQuery] = useState('')
    const [movies, setMovies] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                setError(null)
                const popularMovies = await getPopularMovies()
                setMovies(popularMovies)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        
        loadPopularMovies()
    }, [])

    const handleSearch = async (e) => {
        e.preventDefault(); //阻止表单默认提交行为，防止页面刷新

        if (loading) { return }

        setLoading(true)
        setError(null)

        try {
            const query = searchQuery.trim()
            const results = query ? await searchMovies(query) : await getPopularMovies()
            setMovies(results)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="home">
            <form onSubmit = {handleSearch} className="search-form">
                <input 
                    type="text" 
                    placeholder="Search for movies..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} //更新搜索查询状态，当输入框内容改变时触发
                    className="search-input" 
                />
                <button type="submit" className="search-button">Search</button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="movies-grid">
                    {movies.length > 0 ? (
                        movies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))
                    ) : (
                        <p className="empty-message">No movies found.</p>
                    )}
                </div>
            )}
        </div>
    )
}
export default Home
