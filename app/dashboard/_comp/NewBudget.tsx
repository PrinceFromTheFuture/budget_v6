"use client";
import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Category } from "@/db/schema";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];
function NewBudget({ categoriesOptions }: { categoriesOptions: Category[] }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [categories, setCategories] = React.useState<
    {
      categroyId: string | null;
      amountAllocated: number;
      type: "expenss" | "income";
    }[]
  >([{ categroyId: null, amountAllocated: 0, type: "expenss" }]);

  return (
    <Sheet>
      <SheetTrigger>
        <Button>
          New <Plus />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Plan a new budget</SheetTitle>
        </SheetHeader>
        {categories
          .filter((category) => category.type === "expenss")
          .map((category) => {
            return (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                  >
                    {category.categroyId
                      ? categoriesOptions.find((category) => category.id! === "value")?.name
                      : "Select category..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {categoriesOptions.map((category) => (
                          <CommandItem
                            key={category.id}
                            value={category.name}
                            onSelect={(currentValue) => {
                              const currentArr = categories.slice();
                             
                              const test = currentArr.find(
                                (esxistingCategory) => esxistingCategory.categroyId === category?.id || null
                              )!;

                              console.log(test);
                              setCategories(currentArr);
                              setOpen(false);
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", true ? "opacity-100" : "opacity-0")} />
                            {category.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            );
          })}
      </SheetContent>
    </Sheet>
  );
}

export default NewBudget;
