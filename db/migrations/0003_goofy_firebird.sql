ALTER TABLE "budgets" ALTER COLUMN "budget_categories" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "public"."transactions" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."transaction_type";--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('expense', 'income');--> statement-breakpoint
ALTER TABLE "public"."transactions" ALTER COLUMN "type" SET DATA TYPE "public"."transaction_type" USING "type"::"public"."transaction_type";