import { db } from "@/db";
import { accountsTable } from "@/db/schema";
import { newAccountFormSchema } from "@/lib/zodSchemas";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const formData = newAccountFormSchema.safeParse(body);
  if (formData.error) return NextResponse.json({ success: false, message: "inccorect date" });
  await db.insert(accountsTable).values({ balance: formData.data.balance, name: formData.data.title });
  return NextResponse.json({ success: true });
}
