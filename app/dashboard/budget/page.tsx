import { db } from "@/db";
import { budgetsTable } from "@/db/schema";
import React from "react";

async function page() {
  const allBudgets = await db.select().from(budgetsTable);
  return (
    <section className=" p-4">
      {allBudgets.map((budget) => {
        return <div key={budget.id}></div>;
      })}
    </section>
  );
}

export default page;
