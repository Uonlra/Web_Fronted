import { useEffect, useRef, useState } from "react"

function SortDropdown({ options, value, onChange }) {
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef(null)
    const selectedOption = options.find((option) => option.value === value) || options[0]

    useEffect(() => {
        if (!open) {
            return undefined
        }

        const handlePointerDown = (event) => {
            if (!dropdownRef.current?.contains(event.target)) {
                setOpen(false)
            }
        }

        document.addEventListener("pointerdown", handlePointerDown)

        return () => document.removeEventListener("pointerdown", handlePointerDown)
    }, [open])

    const handleOptionSelect = (nextValue) => {
        onChange(nextValue)
        setOpen(false)
    }

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            setOpen(false)
            return
        }

        if (event.key === "ArrowDown") {
            event.preventDefault()
            setOpen(true)
        }
    }

    return (
        <div className="sort-dropdown" ref={dropdownRef}>
            <button
                type="button"
                className="sort-trigger"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((currentOpen) => !currentOpen)}
                onKeyDown={handleKeyDown}
            >
                <span className="sort-label">Sort by:</span>
                <span className="sort-value">{selectedOption.label}</span>
                <span className={`sort-chevron ${open ? "open" : ""}`} aria-hidden="true">⌄</span>
            </button>

            {open && (
                <div className="sort-menu" role="listbox" aria-label="Sort movies">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`sort-option ${option.value === value ? "active" : ""}`}
                            role="option"
                            aria-selected={option.value === value}
                            onClick={() => handleOptionSelect(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SortDropdown
