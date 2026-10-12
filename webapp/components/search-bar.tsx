"use client"

import { useRef } from "react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@next-hat/ui/components/ui/input-group"
import { Search, X } from "lucide-react"

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
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <InputGroup className="h-12 bg-background">
      <InputGroupAddon className="pl-4">
        <Search aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput
        ref={inputRef}
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-12 [&::-webkit-search-cancel-button]:appearance-none"
        placeholder={placeholder}
        aria-label="Search Statefiles"
      />
      {value && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-sm"
            className="size-10"
            aria-label="Clear search"
            onClick={() => {
              onChange?.("")
              inputRef.current?.focus()
            }}
          >
            <X aria-hidden="true" />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}
