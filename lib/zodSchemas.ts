import { z } from "zod";
const prePostingBudgetSchema = z.object({});

export const newTransactionFormSchema = z.object({
  date: z.date(),
  title: z.string(),
  description: z.string().optional(),
  amount: z.number().min(1),
  accountId: z.string().uuid(),
  categoryId: z.string().uuid(),
});

export const newAccountFormSchema = z.object({ title: z.string(), balance: z.number() });
