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
 * Multi-select combobox with avatars and typeahead search.
 * The field itself is the search input. When nothing is being typed the
 * closed state mirrors select-11: a stack of overlapping avatars + label +
 * an "N/M" count badge. Focus and type to filter; selecting toggles a
 * person without closing.
 */
const MultiAvatarSelectDemo = () => {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<string[]>(["1", "3", "5"])
  const [search, setSearch] = React.useState("")

  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const selectedPeople = people.filter((person) => selected.includes(person.id))

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    )
  }

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
      <Label>Team members</Label>
      <Command
        shouldFilter
        className="overflow-visible bg-transparent p-0"
      >
        <div ref={containerRef} className="relative">
          <div
            onClick={() => inputRef.current?.focus()}
            className="bg-background border-foreground/10 flex h-10 w-full items-center gap-2 rounded-[6px] border px-2 text-sm transition-[color,box-shadow]"
          >
            <div
              className={cn(
                "flex flex-1 items-center gap-2 overflow-hidden",
                selected.length === 0 && "pl-1"
              )}
            >
              {selected.length === 0 ? (
                // Leading slot mirrors a dropdown item's avatar so the
                // placeholder lines up with the names below.
                <span className="flex size-6 shrink-0 items-center justify-center">
                  <SearchIcon className="size-4 shrink-0 opacity-50" />
                </span>
              ) : (
                // Just a count of selected people — no avatar stack.
                <div className="flex shrink-0 items-center pl-1.5">
                  <div className="ring-background bg-primary text-primary-foreground relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full text-[9px] font-medium tabular-nums ring-2">
                    {selectedPeople.length}
                  </div>
                </div>
              )}
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
                placeholder={
                  selected.length === 0
                    ? "Select members"
                    : open
                      ? "Search…"
                      : "Team members"
                }
                className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent outline-none"
              />
            </div>
            {(search || selected.length > 0) && (
              <button
                type="button"
                aria-label={search ? "Clear search" : "Clear all"}
                onClick={(event) => {
                  event.stopPropagation()
                  // Clear the typed query first (keeping selections); only
                  // clear the selected people once the query is empty.
                  if (search) {
                    setSearch("")
                  } else {
                    setSelected([])
                  }
                  inputRef.current?.focus()
                }}
                className="text-muted-foreground/70 hover:text-foreground focus-visible:ring-ring/50 ml-auto flex size-5 shrink-0 items-center justify-center rounded-sm outline-none focus-visible:ring-[3px]"
              >
                <XIcon className="size-4" />
              </button>
            )}
            <ChevronDownIcon
              className={cn(
                "size-4 shrink-0 opacity-50",
                !search && selected.length === 0 && "ml-auto"
              )}
            />
          </div>

          {open && (
            <div className="bg-popover text-popover-foreground ring-foreground/10 animate-in fade-in-0 zoom-in-95 absolute top-full z-50 mt-1 w-full overflow-hidden rounded-[6px] p-0 shadow-md ring-1 duration-100">
              <CommandList>
                <CommandEmpty>No people found.</CommandEmpty>
                <CommandGroup>
                  {people.map((person) => {
                    const isSelected = selected.includes(person.id)

                    return (
                      <CommandItem
                        key={person.id}
                        value={person.name}
                        data-checked={isSelected}
                        onSelect={() => {
                          toggle(person.id)
                          setSearch("")
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

export default MultiAvatarSelectDemo
