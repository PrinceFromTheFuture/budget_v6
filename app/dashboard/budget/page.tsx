import dayjs from "dayjs";
import MoreButton from "@/components/moreButton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { Budget, budgetCategoriesTable, budgetsTable } from "@/db/schema";
import React from "react";
import formatCurrency from "@/lib/formatCurrency";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import NewBudget from "../_comp/NewBudget";

async function page() {
  const allBudgets = await db.select().from(budgetsTable);
  const cateroies = await db.select().from(budgetCategoriesTable);

  const getBudgetBal = (type: "expense" | "income", budget: Budget) =>
    formatCurrency(budget.budgetCategories.filter((section) => section.type === type).reduce((acc, section) => acc + section.amountAllocated, 0));
  return (
    <section className=" p-4">
      <div className=" w-full flex justify-end mb-4 items-center">
        <NewBudget categoriesOptions={cateroies} />
      </div>
      {allBudgets.map((budget) => {
        return (
          <Card key={budget.id}>
            <CardHeader className=" flex-row w-full flex justify-between items-center">
              <div>
                <CardTitle className=" mb-1">{budget.name}</CardTitle>
                <CardDescription>
                  ranges {dayjs(budget.startDate).format("DD/MM/YYYY")} - {dayjs(budget.endDate).format("DD/MM/YYYY")}
                </CardDescription>
              </div>
              <MoreButton />
            </CardHeader>
            <CardContent>{budget.description}</CardContent>
            <CardFooter className=" flex  justify-center items-center w-full">
              <div className=" mr-2 font-semibold">expected income</div>
              <div className="  text-muted-foreground">{getBudgetBal("income", budget)}</div>
              <div className="mr-2 ml-4 font-semibold">expected outcome</div>
              <div className="text-muted-foreground">{getBudgetBal("expense", budget)}</div>
            </CardFooter>
          </Card>
        );
      })}
    </section>
  );
}

export default page;
