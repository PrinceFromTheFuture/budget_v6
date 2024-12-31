"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus, X } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Account, Category } from "@/db/schema";
import LoadingButton from "@/components/LoadingButton";
import axios from "axios";
import { newTransactionFormSchema } from "@/lib/zodSchemas";
import { toast } from "sonner";

function NewTransactions({ accounts, categories }: { accounts: Account[]; categories: Category[] }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof newTransactionFormSchema>>({
    resolver: zodResolver(newTransactionFormSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof newTransactionFormSchema>) {
    setIsLoading(true);
    const res = await axios.post<{ sccuess: boolean; message?: string }>("/api/transactions/new", values);
    if (!res.data.sccuess) {
      toast.error(res.data.message);
      setIsLoading(false);

      return;
    }
    toast.success("transaction saved");
    setIsLoading(false);
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          New <Plus />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className=" w-full flex justify-end">
          <AlertDialogCancel>
            <X />
          </AlertDialogCancel>
        </div>
        <AlertDialogHeader>
          <AlertDialogTitle>New Transaction</AlertDialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => {
                  return (
                    <FormItem className=" mb-4">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="chocolate.. fooot e.g.." {...field} />
                      </FormControl>
                      <FormDescription>Title for the transactions</FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => {
                  return (
                    <FormItem className=" mb-4">
                      <FormLabel>description (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormDescription>This is the description for your transaciton.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => {
                  return (
                    <FormItem className=" mb-4">
                      <FormLabel>Transaction date</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormDescription>this is when your transaction occurance date.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="accountId"
                render={({ field }) => {
                  return (
                    <FormItem className=" mb-4">
                      <FormLabel>transaction account</FormLabel>
                      <FormControl>
                        <Select name={field.name} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full  flex-4">
                            <SelectValue placeholder="Select an account" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Fruits</SelectLabel>
                              {accounts.map((account) => {
                                return (
                                  <SelectItem key={account.id} value={account.id!}>
                                    {account.name}
                                  </SelectItem>
                                );
                              })}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>where is was the money taken from</FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => {
                  return (
                    <FormItem className=" mb-4">
                      <FormLabel>transaction Cateogry</FormLabel>
                      <FormControl>
                        <Select name={field.name} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full  flex-4">
                            <SelectValue placeholder="Select an account" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Fruits</SelectLabel>
                              {categories.map((cat) => {
                                return (
                                  <SelectItem key={cat.id} value={cat.id!}>
                                    {cat.name}
                                  </SelectItem>
                                );
                              })}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>what category is the transaction</FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                name="amount"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem className=" mb-4">
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="shadcn"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>How much did the transaction cost.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <LoadingButton type="submit" isLoading={isLoading} />
            </form>
          </Form>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default NewTransactions;
