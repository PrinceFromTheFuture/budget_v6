import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { accountsTable } from "@/db/schema";
import formatCurrency from "@/lib/formatCurrency";
import React from "react";
import NewAccount from "./_comp/NewAccount";

async function page() {
  const accounts = await db.select().from(accountsTable);
  return (
    <div className=" p-4">
      <div className=" w-full flex justify-end">
        <NewAccount />
      </div>
      <div className=" grid grid-cols-3 gap-4 w-full h-full">
        {accounts.map((account) => {
          return (
            <Card className=" aspect-[2/1] m-0 ">
              <CardHeader>
                <CardTitle>{account.name}</CardTitle>
                <CardDescription>Balance:</CardDescription>
                <CardTitle>{formatCurrency(account.balance)}</CardTitle>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default page;
