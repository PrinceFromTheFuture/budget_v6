ALTER TABLE "budget_sections" RENAME TO "budget_categories";--> statement-breakpoint
ALTER TABLE "budgets" ALTER COLUMN "budegt_sections" DROP DEFAULT;