function MovieSearchForm({
    value,
    loading,
    isSearchMode,
    submittedQuery,
    onChange,
    onSubmit,
    onClear
}) {
    return (
        <div className="search-area">
            <form onSubmit={onSubmit} className="search-form">
                <input
                    type="text"
                    placeholder="Search for movies..."
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="search-input"
                />
                {(value || isSearchMode) && (
                    <button type="button" className="search-clear-button" onClick={onClear}>
                        Clear
                    </button>
                )}
                <button type="submit" className="search-button" disabled={loading}>
                    {loading ? "Searching" : "Search"}
                </button>
            </form>

            {isSearchMode && submittedQuery && (
                <p className="search-status">
                    Showing results for <span>{submittedQuery}</span>
                </p>
            )}
        </div>
    )
}

export default MovieSearchForm
