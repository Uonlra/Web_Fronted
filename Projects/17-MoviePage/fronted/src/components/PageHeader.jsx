function PageHeader({ title, description, className = "", children }) {
    return (
        <header className={className}>
            <h1>{title}</h1>
            {description && <p>{description}</p>}
            {children}
        </header>
    )
}

export default PageHeader
