import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const Budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  amount: varchar("amount", { length: 50 }).notNull(),
  icon: varchar("icon", { length: 100 }),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
});
