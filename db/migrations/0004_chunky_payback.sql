ALTER TABLE "transactions" RENAME COLUMN "budgetId" TO "categoryId";--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_budgetId_budgets_id_fk";
--> statement-breakpoint
ALTER TABLE "budgets" ALTER COLUMN "budget_categories" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_categoryId_budget_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."budget_categories"("id") ON DELETE no action ON UPDATE no action;