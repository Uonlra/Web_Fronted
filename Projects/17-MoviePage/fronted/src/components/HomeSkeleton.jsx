function SkeletonCards() {
    return (
        <div className="skeleton-strip">
            {Array.from({ length: 5 }).map((_, index) => (
                <div className="skeleton-card" key={index}>
                    <div className="skeleton-card-image"></div>
                    <div className="skeleton-line wide"></div>
                    <div className="skeleton-line short"></div>
                </div>
            ))}
        </div>
    )
}

function HomeSkeleton() {
    return (
        <div className="home-skeleton" aria-label="Loading dashboard">
            <section className="dashboard-top">
                <div className="featured-panel skeleton-featured">
                    <div className="skeleton-featured-image"></div>
                    <div className="skeleton-featured-copy">
                        <div className="skeleton-line eyebrow-width"></div>
                        <div className="skeleton-line title-width"></div>
                        <div className="skeleton-line meta-width"></div>
                        <div className="skeleton-line text-width"></div>
                        <div className="skeleton-line text-width"></div>
                        <div className="skeleton-actions">
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div>
                <aside className="watchlist-panel skeleton-watchlist">
                    <div className="skeleton-line heading-width"></div>
                    <div className="skeleton-watchlist-row"></div>
                    <div className="skeleton-watchlist-row"></div>
                    <div className="skeleton-watchlist-row"></div>
                </aside>
            </section>

            <div className="skeleton-search"></div>
            <SkeletonCards />
            <SkeletonCards />
            <SkeletonCards />
        </div>
    )
}

export default HomeSkeleton
