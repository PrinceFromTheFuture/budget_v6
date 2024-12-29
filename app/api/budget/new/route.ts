import { db } from "@/db";
import { budgetsTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body: {
    categories: {
      categroyId: string;
      amountAllocated: number;
      type: "expense" | "income";
      localId: string;
    }[];
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
  } = await req.json();

  console.log(body);
  const dbData = body.categories.map((cat) => {
    return {
      budgetCategoryId: cat.categroyId,
      amountAllocated: cat.amountAllocated,
      type: cat.type,
    };
  });

  await db.insert(budgetsTable).values({
    budgetCategories: dbData,
    name: body.name,
    endDate: body.startDate,
    startDate: body.endDate,
    description: body.description,
  });
  return NextResponse.json({ success: true });
}
