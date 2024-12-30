import { db } from "./db";
import { accountsTable, transactionsTable } from "./db/schema";

const insertFakeTrnasctions = async () => {
  await db.insert(accountsTable).values({
    balance: 19084,
    name: "cash",
  });
};
insertFakeTrnasctions();
