CREATE TYPE "public"."type" AS ENUM('expenss', 'income');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"amount" integer NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "budget_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"name" text NOT NULL,
	"type" "type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "budgets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"budegt_sections" json[] DEFAULT '{}' NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "type" NOT NULL,
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"budgetId" uuid NOT NULL,
	"description" text,
	"amount" integer NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"account_id" uuid
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_budgetId_budgets_id_fk" FOREIGN KEY ("budgetId") REFERENCES "public"."budgets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;