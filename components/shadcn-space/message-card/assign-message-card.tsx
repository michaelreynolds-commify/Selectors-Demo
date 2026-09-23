"use client"

import * as React from "react"

import { Command as CommandPrimitive } from "cmdk"
import {
  CircleCheck,
  Forward,
  Reply,
  SearchIcon,
  SquareCheck,
  Tag,
  UserRoundCheck,
  UserRoundPlus,
  X,
} from "lucide-react"

import { cn } from "cn"

import SingleAvatarSelectDemo from "@/components/shadcn-space/select/select-single-avatar-search"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { people } from "@/lib/people"

/** "Madeline Meyer" -> "Madeline M." — the compact form shown in the pill. */
const shortName = (name: string) => {
  const [first, ...rest] = name.split(" ")
  const last = rest.at(-1)
  return last ? `${first} ${last[0]}.` : first
}

type AssignMessageCardProps = {
  /** Contact line in the header (phone number or company name). */
  contact: string
  /** Small colored "channel" dots + overflow count shown by the contact. */
  tags?: { colors: string[]; extra?: number }
  /** Message timestamp, e.g. "9:12 AM". */
  time: string
  /** Blue avatar initials for the message sender. */
  senderInitials: string
  /** The message body. */
  message: string
  /** Person id to start assigned to (id from lib/people). */
  defaultAssignee?: string
  /**
   * How the assignee is picked. "icon" (default) is the bottom-right
   * trigger + dropdown; "typeahead" swaps in the single-select avatars
   * typeahead field.
   */
  assignControl?: "icon" | "typeahead"
}

/**
 * A message card whose bottom-right control is an assignee picker.
 * The trigger shows a "add person" icon while unassigned; click it to open a
 * searchable dropdown of people. Once assigned it collapses to a name pill +
 * a "person confirmed" icon. Ported from the Figma "Container (margin)" frames.
 */
const AssignMessageCard = ({
  contact,
  tags,
  time,
  senderInitials,
  message,
  defaultAssignee,
  assignControl = "icon",
}: AssignMessageCardProps) => {
  const [open, setOpen] = React.useState(false)
  const [assigneeId, setAssigneeId] = React.useState<string | undefined>(
    defaultAssignee
  )
  const [search, setSearch] = React.useState("")

  const assignRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const assignee = people.find((person) => person.id === assigneeId)

  React.useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (assignRef.current && !assignRef.current.contains(event.target as Node)) {
        setOpen(false)
        setSearch("")
      }
    }

    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [open])

  return (
    <div className="flex w-[405px] flex-col rounded-[6px] bg-[#e2e3e7] shadow-[0px_2px_1px_rgba(45,54,65,0.1),0px_1px_2.5px_rgba(45,54,65,0.09),0px_3px_0.5px_rgba(45,54,65,0.1)]">
      <div className="flex flex-col px-7 pt-4">
        {/* Header: contact + optional channel dots */}
        <div className="flex items-center justify-between border-b-2 border-[#cbced3] pb-3">
          <p className="min-w-0 flex-1 truncate text-[19px] leading-[30.4px] font-bold text-[#626572]">
            {contact}
          </p>
          {tags && (
            <div className="flex shrink-0 items-center">
              {tags.colors.map((color, index) => (
                <span
                  key={index}
                  className="mr-[5px] size-[14px] rounded-[7px]"
                  style={{ backgroundColor: color }}
                />
              ))}
              {tags.extra ? (
                <span className="text-[13px] leading-[20.8px] font-bold text-[#626572]">
                  +{tags.extra}
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* Message: timestamp + sender avatar, then body */}
        <div className="flex flex-col pt-4 pb-4">
          <div className="flex items-center py-[9px]">
            <CircleCheck
              className="size-[18px] shrink-0 text-[#92959f]"
              strokeWidth={1.5}
            />
            <div className="ml-2 flex items-center gap-1 text-[13px] leading-[14px] whitespace-nowrap">
              <span className="font-bold text-[#303944]">{time}</span>
              <span className="text-[#626572]">Today</span>
            </div>
            <div className="flex-1" />
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#056fc7] text-[15px] tracking-[1.5px] text-white uppercase">
              {senderInitials}
            </div>
          </div>
          <p className="text-[16px] leading-[25.6px] text-[#303944]">{message}</p>
        </div>
      </div>

      {/* Footer toolbar */}
      <div
        className={cn(
          "flex items-center justify-between rounded-b-[6px] bg-[#edeef1] px-7",
          assignControl === "typeahead" ? "min-h-12 gap-4 py-2" : "h-12"
        )}
      >
        <div className="flex items-center gap-5 text-[#777b88]">
          <SquareCheck className="size-[22px] text-[#92959f]" />
          <span className="h-[30px] w-px bg-[#cbced3]" />
          <Reply className="size-[21px]" strokeWidth={1.5} />
          <Forward className="size-[21px]" strokeWidth={1.5} />
          <Tag className="size-5" strokeWidth={1.5} />
        </div>

        {assignControl === "typeahead" ? (
          <div className="w-48 shrink-0">
            <SingleAvatarSelectDemo hideLabel menuPlacement="top" />
          </div>
        ) : (
          /* Assign trigger: field-typeahead when unassigned + active,
             pill when assigned, bare icon when unassigned + inactive. */
          <div ref={assignRef} className="relative">
            <Command
              key={open ? "open" : "closed"}
              shouldFilter
              className="overflow-visible bg-transparent p-0"
            >
              <div className="flex items-center justify-end gap-2">
                {assignee ? (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() => setOpen((prev) => !prev)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        setOpen((prev) => !prev)
                      }
                    }}
                    className="flex cursor-pointer items-center gap-1.5 rounded-full bg-white py-0.5 pr-2 pl-1.5 text-[15px] leading-[18px] font-bold tracking-[0.375px] text-[#303944]"
                  >
                    <button
                      type="button"
                      aria-label="Clear assignment"
                      onClick={(event) => {
                        event.stopPropagation()
                        // Clearing keeps the selector's open state: if it's
                        // active you drop into the search field, otherwise
                        // it returns to the bare icon (initial state).
                        setAssigneeId(undefined)
                        setSearch("")
                      }}
                      className="flex size-3.5 shrink-0 items-center justify-center rounded-full text-[#777b88] hover:text-[#303944]"
                    >
                      <X className="size-3.5" strokeWidth={2} />
                    </button>
                    {shortName(assignee.name)}
                  </span>
                ) : (
                  open && (
                    <div className="flex items-center gap-1.5 rounded-full bg-white py-1 pr-2.5 pl-2">
                      <SearchIcon className="size-3.5 shrink-0 text-[#777b88]" />
                      <CommandPrimitive.Input
                        ref={inputRef}
                        autoFocus
                        value={search}
                        onValueChange={setSearch}
                        onKeyDown={(event) => {
                          if (event.key === "Escape") {
                            setOpen(false)
                            setSearch("")
                          }
                        }}
                        placeholder="Find a user"
                        className="w-24 bg-transparent text-[15px] leading-[18px] font-bold tracking-[0.375px] text-[#303944] outline-none placeholder:font-bold placeholder:text-[#626572]"
                      />
                    </div>
                  )
                )}
                <button
                  type="button"
                  aria-label={assignee ? `Assigned to ${assignee.name}` : "Assign"}
                  onClick={() => {
                    setOpen((prev) => !prev)
                    setSearch("")
                  }}
                  className="focus-visible:ring-ring/50 flex size-5 shrink-0 items-center justify-center rounded-full text-[#777b88] outline-none hover:text-[#303944] focus-visible:ring-[3px]"
                >
                  {assignee ? (
                    <UserRoundCheck className="size-5" strokeWidth={2} />
                  ) : (
                    <UserRoundPlus className="size-5" strokeWidth={1.5} />
                  )}
                </button>
              </div>

              {open && (
                <div className="bg-popover text-popover-foreground ring-foreground/10 animate-in fade-in-0 zoom-in-95 absolute right-0 bottom-full z-50 mb-2 w-64 overflow-hidden rounded-[6px] p-0 shadow-md ring-1 duration-100">
                  <CommandList>
                    <CommandEmpty>No people found.</CommandEmpty>
                    <CommandGroup>
                      {people.map((person) => (
                        <CommandItem
                          key={person.id}
                          value={person.name}
                          data-checked={person.id === assigneeId}
                          onSelect={() => {
                            setAssigneeId((prev) =>
                              prev === person.id ? undefined : person.id
                            )
                            setOpen(false)
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
                      ))}
                    </CommandGroup>
                  </CommandList>
                </div>
              )}
            </Command>
          </div>
        )}
      </div>
    </div>
  )
}

export default AssignMessageCard
