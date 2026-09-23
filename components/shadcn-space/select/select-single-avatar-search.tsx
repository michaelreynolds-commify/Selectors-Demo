"use client"

import * as React from "react"

import { Command as CommandPrimitive } from "cmdk"
import { cn } from "cn"
import { ChevronDownIcon, SearchIcon, XIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import { people } from "@/lib/people"

/**
 * Single-select combobox with avatars and typeahead search.
 * The field itself is the search input: when nothing is being typed it
 * shows the selected person's avatar + name; focus it and type to filter
 * the list below. Selecting closes and clears the query.
 */
type SingleAvatarSelectDemoProps = {
  /** Hide the "Assignee" label (useful when embedded inline). */
  hideLabel?: boolean
  /** Open the menu above the field instead of below it. */
  menuPlacement?: "top" | "bottom"
}

const SingleAvatarSelectDemo = ({
  hideLabel = false,
  menuPlacement = "bottom",
}: SingleAvatarSelectDemoProps = {}) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string>("1")
  const [search, setSearch] = React.useState("")

  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const selected = people.find((person) => person.id === value)
  const showOverlay = Boolean(selected) && !search

  React.useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
        setSearch("")
      }
    }

    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [open])

  return (
    <div className="w-full max-w-xs space-y-2">
      {!hideLabel && <Label>Assignee</Label>}
      <Command
        shouldFilter
        className="overflow-visible bg-transparent p-0"
      >
        <div ref={containerRef} className="relative">
          <div
            onClick={() => inputRef.current?.focus()}
            className="bg-background border-foreground/10 flex h-9 w-full items-center gap-2 rounded-[6px] border px-2 text-sm transition-[color,box-shadow]"
          >
            <div className="relative flex flex-1 items-center gap-2 overflow-hidden">
              {showOverlay && selected && (
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center gap-2 truncate">
                  <Avatar className="size-5">
                    <AvatarImage src={selected.src} alt={selected.name} />
                    <AvatarFallback className="text-[10px]">
                      {selected.fallback}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{selected.name}</span>
                </span>
              )}
              <SearchIcon
                className={cn(
                  "size-4 shrink-0 opacity-50",
                  showOverlay && "opacity-0"
                )}
              />
              <CommandPrimitive.Input
                ref={inputRef}
                value={search}
                onValueChange={(next) => {
                  setSearch(next)
                  setOpen(true)
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setOpen(false)
                    setSearch("")
                    inputRef.current?.blur()
                  }
                }}
                placeholder={selected ? "" : "Select assignee"}
                className="placeholder:text-muted-foreground flex-1 bg-transparent outline-none"
              />
            </div>
            {selected && (
              <button
                type="button"
                aria-label="Clear selection"
                onClick={(event) => {
                  event.stopPropagation()
                  setValue("")
                  setSearch("")
                  inputRef.current?.focus()
                }}
                className="text-muted-foreground/70 hover:text-foreground focus-visible:ring-ring/50 flex size-5 shrink-0 items-center justify-center rounded-sm outline-none focus-visible:ring-[3px]"
              >
                <XIcon className="size-4" />
              </button>
            )}
            <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
          </div>

          {open && (
            <div
              className={cn(
                "bg-popover text-popover-foreground ring-foreground/10 animate-in fade-in-0 zoom-in-95 absolute z-50 w-full overflow-hidden rounded-[6px] p-0 shadow-md ring-1 duration-100",
                menuPlacement === "top" ? "bottom-full mb-1" : "top-full mt-1"
              )}
            >
              <CommandList>
                <CommandEmpty>No people found.</CommandEmpty>
                <CommandGroup>
                  {people.map((person) => {
                    const isSelected = person.id === value

                    return (
                      <CommandItem
                        key={person.id}
                        value={person.name}
                        data-checked={isSelected}
                        className="rounded-[4px]"
                        onSelect={() => {
                          setValue(person.id)
                          setSearch("")
                          setOpen(false)
                          inputRef.current?.blur()
                        }}
                      >
                        <Avatar className="size-6">
                          <AvatarImage src={person.src} alt={person.name} />
                          <AvatarFallback className="text-[10px]">
                            {person.fallback}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm leading-none">
                            {person.name}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {person.role}
                          </span>
                        </div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </div>
          )}
        </div>
      </Command>
    </div>
  )
}

export default SingleAvatarSelectDemo
