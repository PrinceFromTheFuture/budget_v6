import { db } from "@/db";
import { accountsTable, budgetCategoriesTable, budgetsTable, transactionsTable } from "@/db/schema";
import React from "react";
import { DataTable } from "./_comp/DataTable";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import NewTransactions from "./_comp/NewTransactions";

async function page() {
  const transactions = await db.select().from(transactionsTable);
  const budgets = await db.select().from(budgetsTable);
  const accounts = await db.select().from(accountsTable);
  const categories = await db.select().from(budgetCategoriesTable);

  return (
    <div className=" p-4">
      <div className=" font-semi text-xl">All transactions</div>
      <div className=" w-full flex justify-end">
        <NewTransactions categories={categories} accounts={accounts} />
      </div>
      <DataTable budgets={budgets} transctions={transactions} />
    </div>
  );
}

export default page;
