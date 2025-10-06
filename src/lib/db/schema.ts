import { 
  int, 
  mysqlEnum, 
  mysqlTable, 
  varchar, 
  text, 
  timestamp,
  date,
  time
} from "drizzle-orm/mysql-core";


// Users table - represents each dog owner
export const User = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  bio: text("bio"),
  location: varchar("location", { length: 255 }),
  available_times: text("available_times"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Dogs table - represents each dog profile
export const Dog = mysqlTable("dogs", {
  id: int("id").autoincrement().primaryKey(),
  owner_id: int("owner_id").notNull().references(() => User.id),
  name: varchar("name", { length: 100 }).notNull(),
  sex: mysqlEnum("sex", ["Male", "Female"]).notNull(),
  breed: varchar("breed", { length: 100 }).notNull(),
  age: int("age").notNull(),
  size: mysqlEnum("size", ["Small", "Medium", "Large"]).notNull(),
  temperament: text("temperament"),
  vaccination_status: varchar("vaccination_status", { length: 50 }).notNull(), // "Up-to-date", "Needs shots"
  photo_url: varchar("photo_url", { length: 500 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// PlaydateRequests table - represents invitations between users
export const PlaydateRequests = mysqlTable("playdate_requests", {
  id: int("id").autoincrement().primaryKey(),
  sender_id: int("sender_id").notNull().references(() => User.id),
  receiver_id: int("receiver_id").notNull().references(() => User.id),
  dog_id: int("dog_id").notNull().references(() => Dog.id),
  date: date("date").notNull(),
  time: time("time").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["pending", "accepted", "rejected"]).notNull().default("pending"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Messages table - for communication between users
export const Message = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  sender_id: int("sender_id").notNull().references(() => User.id),
  receiver_id: int("receiver_id").notNull().references(() => User.id),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});