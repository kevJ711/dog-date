import { int, mysqlEnum, mysqlTable, varchar, text, date, time, timestamp } from "drizzle-orm/mysql-core";

// Users table - Updated to match database plan
export const User = mysqlTable("users", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    password_hash: varchar("password_hash", { length: 255 }).notNull(),
    bio: text("bio"),
    location: varchar("location", { length: 100 }),
    available_times: varchar("available_times", { length: 200 }),
});

// Dogs table - Updated to match database plan
export const Dog = mysqlTable("dogs", {
    id: int("id").autoincrement().primaryKey(),
    owner_id: int("owner_id").notNull().references(() => User.id),
    name: varchar("name", { length: 100 }).notNull(),
    sex: mysqlEnum("sex", ["Male", "Female"]),
    breed: varchar("breed", { length: 100 }),
    age: int("age"),
    size: mysqlEnum("size", ["Small", "Medium", "Large"]),
    temperament: text("temperament"),
    vaccination_status: varchar("vaccination_status", { length: 50 }),
    photo_url: varchar("photo_url", { length: 500 }),
});

// PlaydateRequests table - NEW! This was completely missing
export const PlaydateRequest = mysqlTable("playdate_requests", {
    id: int("id").autoincrement().primaryKey(),
    sender_id: int("sender_id").notNull().references(() => User.id),
    receiver_id: int("receiver_id").notNull().references(() => User.id),
    dog_id: int("dog_id").notNull().references(() => Dog.id),
    date: date("date"),
    time: time("time"),
    location: varchar("location", { length: 200 }),
    status: mysqlEnum("status", ["pending", "accepted", "rejected"]).default("pending"),
    created_at: timestamp("created_at").defaultNow(),
});

// Messages table - Keep existing but add proper foreign key constraints
export const Message = mysqlTable("messages", {
    id: int("id").autoincrement().primaryKey(),
    sender_id: int("sender_id").notNull().references(() => User.id),
    receiver_id: int("receiver_id").notNull().references(() => User.id),
    content: text("content").notNull(),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
});
