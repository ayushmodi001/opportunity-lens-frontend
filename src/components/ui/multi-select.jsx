"use client"

import * as React from "react"
import { cva } from "class-variance-authority";
import { Check, X, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge";

const multiSelectVariants = cva(
    "m-1",
    {
        variants: {
            variant: {
                default: "border-foreground",
                secondary: "border-secondary text-secondary-foreground",
                destructive: "border-destructive text-destructive-foreground",
                inverted: "border-primary-foreground text-primary-foreground"
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

const MultiSelect = React.forwardRef(
    ({ className, variant, options, selected, onChange, ...props }, ref) => {
        const [open, setOpen] = React.useState(false)

        const handleUnselect = (item) => {
            onChange(selected.filter((i) => i !== item))
        }

        return (
            <Popover open={open} onOpenChange={setOpen} {...props}>
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={`w-full justify-between ${selected.length > 0 ? 'h-full' : 'h-10'}`}
                        onClick={() => setOpen(!open)}
                    >
                        <div className="flex gap-1 flex-wrap">
                            {selected.length > 0 ? selected.map((item) => (
                                <Badge
                                    key={item}
                                    className={cn(multiSelectVariants({ variant }))}
                                    style={{ animation: "scaleIn 0.3s ease-in-out" }}
                                >
                                    {item}
                                    <button
                                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleUnselect(item);
                                            }
                                        }}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onClick={() => handleUnselect(item)}
                                    >
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </button>
                                </Badge>
                            )) : "Select..."}
                        </div>
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command className={className}>
                        <CommandInput placeholder="Search ..." />
                        <CommandList>
                            <CommandEmpty>No item found.</CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-auto">
                                {options.map((option) => (
                                    <CommandItem
                                        key={option}
                                        onSelect={() => {
                                            onChange(
                                                selected.includes(option)
                                                    ? selected.filter((item) => item !== option)
                                                    : [...selected, option]
                                            )
                                            setOpen(true)
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selected.includes(option) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {option}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        )
    }
)

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
