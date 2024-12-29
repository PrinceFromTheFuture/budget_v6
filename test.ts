import db from "./db";
import { testTable } from "./db/schema";

const testFunc = async () => {
  const val = await db.select().from(testTable);
  console.log(val);
};
testFunc();
