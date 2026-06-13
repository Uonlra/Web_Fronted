export const DEFAULT_WATCH_STATUS = "not-started"

export const WATCH_STATUS_OPTIONS = [
    { label: "Not Started", value: "not-started" },
    { label: "Watching", value: "watching" },
    { label: "Watched", value: "watched" }
]

export const WATCH_STATUS_FILTER_OPTIONS = [
    { label: "All", value: "all" },
    ...WATCH_STATUS_OPTIONS
]

export const WATCH_STATUS_LABELS = {
    "not-started": "Not Started",
    watching: "Watching",
    watched: "Watched"
}

export const NEXT_WATCH_STATUS = {
    "not-started": "watching",
    watching: "watched",
    watched: "watching"
}

export const WATCH_STATUS_ACTION_LABELS = {
    "not-started": "Start",
    watching: "Mark Watched",
    watched: "Rewatch"
}

export const VALID_WATCH_STATUSES = new Set(WATCH_STATUS_OPTIONS.map((option) => option.value))
