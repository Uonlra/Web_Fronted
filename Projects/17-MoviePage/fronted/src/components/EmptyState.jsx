function EmptyState({ title, description, className = "", children }) {
    return (
        <div className={className}>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
            {children}
        </div>
    )
}

export default EmptyState
