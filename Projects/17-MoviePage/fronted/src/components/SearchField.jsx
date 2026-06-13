function SearchField({
    value,
    onChange,
    onSubmit,
    placeholder,
    ariaLabel,
    className = "",
    icon = "⌕"
}) {
    const handleSubmit = (event) => {
        event.preventDefault()
        onSubmit?.(event)
    }

    return (
        <form className={className} role="search" onSubmit={handleSubmit}>
            <span aria-hidden="true">{icon}</span>
            <input
                type="search"
                placeholder={placeholder}
                aria-label={ariaLabel}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </form>
    )
}

export default SearchField
