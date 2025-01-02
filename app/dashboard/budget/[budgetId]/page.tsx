import { db } from "@/db";
import { Budget, budgetCategoriesTable, budgetsTable, transactionsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import { validate } from "uuid";
import { ExpectedExpensess } from "./_comp/ExpectedIncomes";
import { ExpectedIncomes } from "./_comp/ExpectedExpensess";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ActualExpensess } from "./_comp/ActualExpensess";
import { ActualIncomes } from "./_comp/ActualIncomes";
import dayjs from "dayjs";
import { TransactionsDataTable } from "@/components/TransactionsDataTable";
import { IncomeVsOutcomeBarGraph } from "./_comp/IncomeVsOutcomeBarGraph";

async function page({ params }: { params: Promise<{ budgetId: string }> }) {
  const budgetId = (await params).budgetId;
  if (!validate(budgetId)) {
    return redirect("/dashboard/budgets");
  }
  const budget = (await db.select().from(budgetsTable).where(eq(budgetsTable.id, budgetId)))[0] as Budget | null;
  if (!budget) {
    return redirect("/dashboard/budgets");
  }
  const categories = await db.select().from(budgetCategoriesTable);
  const transactions = await db.select().from(transactionsTable);

  const thisBudgetTransactions = transactions.filter(
    (trans) => dayjs(trans.date).isAfter(budget.startDate) && dayjs(trans.date).isBefore(budget.endDate)
  );

  return (
    <div className=" p-4">
      <div>
        <Card className=" w-full m-0">
          <CardHeader className=" ">
            <CardTitle>you should end your month in 398 net</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div className=" flex justify-between gap-6">
        <div className=" w-full text-lg mb-2 font-bold">Expected</div>
        <div className=" w-full text-lg mb-2 font-bold">Actual</div>
      </div>
      <div className=" flex justify-between items-center gap-6 mb-8">
        <ExpectedExpensess categories={categories} budget={budget} />
        <ExpectedIncomes categories={categories} budget={budget} />

        <ActualExpensess transactions={thisBudgetTransactions} categories={categories} budget={budget} />
        <ActualIncomes transactions={thisBudgetTransactions} categories={categories} budget={budget} />
      </div>
      <IncomeVsOutcomeBarGraph transactions={thisBudgetTransactions} budget={budget} />
      <div className=" mt-8">Transctions this budget</div>
      <TransactionsDataTable budgets={[budget]} transctions={transactions} />
    </div>
  );
}

export default page;
