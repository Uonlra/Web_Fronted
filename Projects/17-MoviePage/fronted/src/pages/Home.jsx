import MovieCard from "../components/MovieCard"
import {useState} from 'react'

function Home() {
    
    const [searchQuery, setSearchQuery] = useState('')
    
    
    const movies = [
        {
            id: 1,
            title: "Inception",
            releaseDate: "2010",
            posterUrl: "https://m.media-amazon.com/images/I/51s+qvXoG9L._AC_.jpg"
        },
        {
            id: 2,
            title: "The Dark Knight",
            releaseDate: "2008",
            posterUrl: "https://m.media-amazon.com/images/I/51k0qa2q9lL._AC_.jpg"
        },
        {
            id: 3,
            title: "Interstellar",
            releaseDate: "2014",
            posterUrl: "https://m.media-amazon.com/images/I/71nq+9s+8eL._AC_SY679_.jpg"
        }

    ]

    const handleSearch = (e) => {
        e.preventDefault(); //阻止表单默认提交行为，防止页面刷新
        alert(`Searching for: ${searchQuery}`)
        setSearchQuery('') 
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
            <div className="movie-grid">
                {movies.map((movie) => (
                    movie.title.toLowerCase().startsWith(searchQuery.toLowerCase()) 
                    && (<MovieCard key={movie.id} movie={movie} />

                    )
                ))}
            </div>
        </div>
    )
}
export default Home