import { db } from "@/db";
import { Budget, budgetsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import {UUIDTypes} from 'uuid'
import { z, } from "zod";

const v4 = z.string().isUUid
async function page({ params }: { params: Promise<{ budgetId: string }> }) {
  const budgetId = (await params).budgetId;
  if (typeof budgetId !== typeof UUIDTypes ) {
    return redirect("/dashboard/budgets");
  }
  const budget = (await db.select().from(budgetsTable).where(eq(budgetsTable.id, budgetId)))[0] as Budget | null;
  if (!budget) {
    return redirect("/dashboard/budgets");
  }
  return <div>page</div>;
}

export default page;
