"use client";
import TextAreaAutoSize from "react-textarea-autosize";
import { v4 } from "uuid";
import { useState } from "react";
import { CalendarIcon, Check, ChevronsUpDown, Minus, Plus } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Category } from "@/db/schema";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingButton from "@/components/LoadingButton";
import { Separator } from "@/components/ui/separator";
import dayjs from "dayjs";
import { toast } from "sonner";

function NewBudget({ categoriesOptions }: { categoriesOptions: Category[] }) {
  const [categories, setCategories] = useState<
    {
      categroyId: string | null;
      amountAllocated: number;
      type: "expense" | "income";
      localId: string;
    }[]
  >([]);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const onChangeCat = (categoryOptionId: string, localCategoryId: string) => {
    const newCategories = categories.slice();
    newCategories.find((cat) => cat.localId === localCategoryId)!.categroyId = categoryOptionId;
    setCategories(newCategories);
  };
  const onChangeCatType = (type: "expense" | "income", localCategoryId: string) => {
    const newCategories = categories.slice();
    newCategories.find((cat) => cat.localId === localCategoryId)!.type = type;
    setCategories(newCategories);
  };
  const onChangeCatAmountAllocation = (newAmount: number, localCategoryId: string) => {
    const newCategories = categories.slice();
    newCategories.find((cat) => cat.localId === localCategoryId)!.amountAllocated = newAmount;
    setCategories(newCategories);
  };
  const onDeleteCat = (localCategoryId: string) => {
    const newCategories = categories.slice().filter((cat) => cat.localId !== localCategoryId);
    setCategories(newCategories);
  };
  const onAddNewCategory = () => {
    if (categories.length > 20) return;
    const newEmptyCat: {
      categroyId: string;
      amountAllocated: number;
      type: "expense" | "income";
      localId: string;
    } = { amountAllocated: 0, categroyId: categoriesOptions[0].id!, localId: v4(), type: "expense" };

    const newCategories = categories.slice();
    newCategories.push(newEmptyCat);
    setCategories(newCategories);
  };

  function throwErr(messgae: string) {
    setIsLoading(false);
    toast.error(messgae);
  }
  function onSubmit() {
    setIsLoading(true);
    //validate some cats are defined
    if (categories.length === 0) {
      throwErr("at least one cat must be defined");
      return;
    }
    //validate same category name wasnt called twice
    for (const catOption of categoriesOptions) {
      if (categories.filter((cat) => cat.categroyId === catOption.id).length > 1) {
        throwErr(" you cannot use the same catogry twice");
        return;
      }
    }
    // validate each cat is > 0
    for (const category of categories) {
      if (category.amountAllocated < 1) {
        throwErr(" the min value for the category item is 0");
        return;
      }
    }
    //validate end date is after startDate
    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      throwErr(" the end date must be after the start Date");
      return;
    }
    if (!name) {
      throwErr("you got to provide a nuickname ");
      return;
    }

    axios.post("/api/budget/new", { categories, startDate, endDate, name, description });
  }

  return (
    <Sheet>
      <SheetTrigger>
        <Button>
          New <Plus />
        </Button>
      </SheetTrigger>
      <SheetContent className=" min-w-[35vw] flex flex-col items-center justify-between">
        <div className=" w-full">
          <SheetHeader className=" mb-8">
            <SheetTitle>Plan a new budget</SheetTitle>
          </SheetHeader>
          <Label htmlFor=" ">Nickname</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className=" mt-1" />
          <div className=" flex flex-col mt-8">
            <Label htmlFor=" ">Description</Label>
            <TextAreaAutoSize
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className=" mt-1 resize-none flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            />
          </div>
          <div className=" w-full flex justify-between mt-8 mb-2 gap-2">
            <Label className=" w-full">Start date</Label>
            <Label className=" w-full">End date</Label>
          </div>
          <div className=" flex w-full gap-2 ">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <Separator className=" my-8 w-4/5" />
          <div className=" w-full flex justify-between text-sm font-semibold mb-2 gap-2 items-end mt-8">
            <div className=" w-[5%] h-fit "></div>
            <Label className=" w-[40%] ">Cateory lable</Label>
            <Label className=" w-[30%] ">Cateory type</Label>
            <Label className=" w-[25%] ">Amount allocated</Label>
          </div>
          <ScrollArea className=" h-[50vh]">
            <div className=" flex flex-col gap-2">
              {categories.map((category) => {
                return (
                  <div className=" flex gap-2">
                    <Button
                      onClick={() => {
                        onDeleteCat(category.localId);
                      }}
                      variant={"destructive"}
                      className=" w-[5%]"
                    >
                      <Minus />
                    </Button>
                    <Select defaultValue={category.categroyId!} onValueChange={(categoryOptionId) => onChangeCat(categoryOptionId, category.localId)}>
                      <SelectTrigger className="w-[40%]  flex-4">
                        <SelectValue placeholder="Select a fruit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Fruits</SelectLabel>
                          {categoriesOptions.map((categoryOption) => {
                            return (
                              <SelectItem key={categoryOption.id} value={categoryOption.id!}>
                                {categoryOption.name}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Select
                      defaultValue={category.type}
                      onValueChange={(newType) => onChangeCatType(newType as "expense" | "income", category.localId)}
                    >
                      <SelectTrigger className="w-[30%]">
                        <SelectValue placeholder="Select a Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select a Type</SelectLabel>
                          <SelectItem value={"expenss"}>expenss</SelectItem>
                          <SelectItem value={"income"}>icnome</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Input
                      min={1}
                      value={category.amountAllocated}
                      onChange={(e) => {
                        onChangeCatAmountAllocation(e.target.value as unknown as number, category.localId);
                      }}
                      type="number"
                      className="  w-[25%]"
                      placeholder=" place amount in agorot!"
                    />
                  </div>
                );
              })}
              <Button onClick={onAddNewCategory} className=" mt-2" variant={"outline"}>
                new Cateory <Plus />
              </Button>
            </div>
          </ScrollArea>
        </div>
        <SheetFooter className=" w-full">
          <Button onClick={onSubmit} className=" w-full">
            <LoadingButton isLoading={isLoading} />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default NewBudget;
