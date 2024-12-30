import { db } from "@/db";
import { accountsTable, budgetCategoriesTable, budgetsTable, transactionsTable } from "@/db/schema";
import { newTransactionFormSchema } from "@/lib/zodSchemas";
import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  body.date = new Date(body.date);
  const trnasactionForm = newTransactionFormSchema.safeParse(body);
  if (trnasactionForm.error) {
    return NextResponse.json({ error: true });
  }

  //query the budget which is currently active at the time of the transaction   
  //meaning its start date is before now and its end date is after now
  //according to the acrtecture there can only be 0 or 1 budgets which satefies this conditions
  //so acciising the fiest elment in the array can saftly be done

  const budgets = await db.select().from(budgetsTable);
  const currentActiveBudget = budgets.filter(
    (budget) =>
      dayjs(budget.startDate).isBefore(dayjs(trnasactionForm.data.date)) &&
      dayjs(budget.endDate).isAfter(dayjs(trnasactionForm.data.date))
  )[0];
  if (!currentActiveBudget)
    return NextResponse.json({ success: false, message: "there is no currently active budget" });

  const transactionAccount = (
    await db.select().from(accountsTable).where(eq(accountsTable.id, trnasactionForm.data.accountId))
  )[0];
  const currentAccountBalance = transactionAccount.balance;

  await db
    .update(accountsTable)
    .set({ balance: currentAccountBalance - trnasactionForm.data.amount })
    .where(eq(accountsTable.id, trnasactionForm.data.accountId));

  await db.insert(transactionsTable).values({
    amount: trnasactionForm.data.amount,
    title: trnasactionForm.data.title,
    type: "expense",
    date: trnasactionForm.data.date,
    description: trnasactionForm.data.description,
    accountId: trnasactionForm.data.accountId,
    budgetId: currentActiveBudget.id,
  });
  return NextResponse.json({ sccuess: true });
}
