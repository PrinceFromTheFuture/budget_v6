ALTER TABLE "budgets" ALTER COLUMN "budegt_sections" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "budgets" ALTER COLUMN "budegt_sections" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "budgets" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "budgets" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "budget_sections" DROP COLUMN "type";