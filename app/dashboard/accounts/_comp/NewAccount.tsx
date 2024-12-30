"use client";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { newAccountFormSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Plus } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { z } from "zod";

function NewAccount() {
  const form = useForm<z.infer<typeof newAccountFormSchema>>({
    resolver: zodResolver(newAccountFormSchema),
    defaultValues: {},
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (values: z.infer<typeof newAccountFormSchema>) => {
    setIsLoading(true);
    const res = await axios.post<{ sccuess: boolean; message?: string }>("/api/accounts/new", values);
    if (!res.data.sccuess) {
      toast.error(res.data.message);
      return;
    }
    toast.success("transaction saved");
    setIsLoading(false);
  };

  return (
    <Sheet>
      <SheetTrigger>
        <Button>
          New <Plus />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create New Account</SheetTitle>
          <SheetDescription>Create New Account</SheetDescription>
        </SheetHeader>
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
                      <Input placeholder="bank... cash e.g.." {...field} />
                    </FormControl>
                    <FormDescription>Title for the Account</FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => {
                return (
                  <FormItem className=" mb-4">
                    <FormLabel>Balance</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="2345 8974 242"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>How much does the account holds in agorot</FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <LoadingButton type="submit" isLoading={isLoading} />
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default NewAccount;
