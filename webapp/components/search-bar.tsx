"use client"

export interface SearchBarProps {
  placeholder?: string
  onChange?: (value: string) => void
  value?: string
  id?: string
}

export default function SearchBar({
  placeholder = "Search…",
  onChange,
  value = "",
  id,
}: SearchBarProps) {
  return (
    <div className="w-full">
      <input
        id={id}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder={placeholder}
        aria-label="Search"
      />
    </div>
  )
}
