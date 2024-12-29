import { boolean, integer, json, pgEnum, pgTable, serial, text, timestamp, uuid, jsonb, PgUUID, date } from "drizzle-orm/pg-core";

export const transactionTypeEnum = pgEnum("type", ["expenss", "income"]);

export const accountsTable = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  balance: integer("amount").notNull(),
  name: text("name").notNull(),
});

export const budgetSectionsTable = pgTable("budget_sections", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  name: text("name").notNull(),
});

export const budgetsTable = pgTable("budgets", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  budegtSections: json("budegt_sections")
    .$type<{ budgetSectionId: string; amountAllocated: number; type: "expenss" | "income" }[]>()
    .default([])
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),

  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
});

export const transactionsTable = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  type: transactionTypeEnum().notNull(),
  date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
  title: text("title").notNull(),
  budgetId: uuid("budgetId")
    .references(() => budgetsTable.id)
    .notNull(),
  description: text("description"),
  amount: integer("amount").notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  accountId: uuid("account_id").references(() => accountsTable.id),
});
