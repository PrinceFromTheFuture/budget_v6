import { db } from "@/db";
import { Budget, budgetsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import { validate } from "uuid";
import { Component,  } from "./_comp/PieChart";

async function page({ params }: { params: Promise<{ budgetId: string }> }) {
  const budgetId = (await params).budgetId;
  if (!validate(budgetId)) {
    return redirect("/dashboard/budgets");
  }
  const budget = (
    await db.select().from(budgetsTable).where(eq(budgetsTable.id, budgetId))
  )[0] as Budget | null;
  if (!budget) {
    return redirect("/dashboard/budgets");
  }
  return (
    <div>
      page
      <Component />
    </div>
  );
}

export default page;
