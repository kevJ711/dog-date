import { int, mysqlEnum, mysqlTable, uniqueIndex, varchar, serial, timestamp }
 from "drizzle-orm/mysql-core";

 //Creating dummy user
 export const User = mysqlTable("users" , {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).notNull(),
    username: varchar("username", { length: 100 }).notNull(),
    password: varchar("password", { length: 255 }).notNull()
 });