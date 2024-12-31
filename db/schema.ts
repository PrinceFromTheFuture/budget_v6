import { InferInsertModel } from "drizzle-orm";
import {
  boolean,
  integer,
  json,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  jsonb,
  PgUUID,
  date,
} from "drizzle-orm/pg-core";
export const transactionTypeEnum = pgEnum("transaction_type", ["expense", "income"]);

export const accountsTable = pgTable("accounts", {
  id: uuid("id").notNull().defaultRandom().primaryKey(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  balance: integer("amount").notNull(),
  name: text("name").notNull(),
});

export const budgetCategoriesTable = pgTable("budget_categories", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  name: text("name").notNull(),
});

export const budgetsTable = pgTable("budgets", {
  id: uuid("id").notNull().defaultRandom().notNull().primaryKey().notNull(),
  budgetCategories: json("budget_categories")
    .$type<{ budgetCategoryId: string; amountAllocated: number; type: "expense" | "income" }[]>()
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
});

export const transactionsTable = pgTable("transactions", {
  id: uuid("id").notNull().defaultRandom().notNull().primaryKey().notNull(),
  type: transactionTypeEnum().notNull(),
  date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
  title: text("title").notNull(),
  categoryId: uuid("categoryId")
    .references(() => budgetCategoriesTable.id)
    .notNull(),
  description: text("description"),
  amount: integer("amount").notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  accountId: uuid("account_id").references(() => accountsTable.id),
});

export type Budget = InferInsertModel<typeof budgetsTable>;
export type Category = InferInsertModel<typeof budgetCategoriesTable>;
export type Transaction = InferInsertModel<typeof transactionsTable>;
export type Account = InferInsertModel<typeof accountsTable>;
