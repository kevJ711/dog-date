import { int, mysqlEnum, mysqlTable, uniqueIndex, varchar, serial, timestamp }
 from "drizzle-orm/mysql-core";

 //Creating dummy user
 export const User = mysqlTable("users" , {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).notNull(),
    username: varchar("username", { length: 100 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
 });

export const Dog = mysqlTable("dogs" , {
      dog_name: varchar("dog_name", { length: 100 }).notNull(),
      id: int("id").autoincrement().primaryKey(),
      owner_id: int("owner_id").notNull().references(() => User.id),
      breed: varchar("breed", { length: 100 }).notNull(),
      age: int("age").notNull(),
      vaccinated: mysqlEnum("vaccinated", ["yes", "no"]).notNull(),
      photo_url: varchar("photo_url", { length: 255 }).notNull(),
});

export const Message = mysqlTable("messages" , {
      id: int("id").autoincrement().primaryKey(),
      sender_id: int("sender_id").notNull().references(() => User.id),
      receiver_id: int("receiver_id").notNull().references(() => User.id),
      content: varchar("content", { length: 1000 }).notNull(),
      timestamp: timestamp("timestamp").defaultNow().notNull(),
});
