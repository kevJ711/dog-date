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
  username: varchar("username", { length: 100 }).notNull().unique(),
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
  dog_name: varchar("dog_name", { length: 100 }).notNull(),
  sex: mysqlEnum("sex", ["Male", "Female"]),
  breed: varchar("breed", { length: 100 }).notNull(),
  age: int("age").notNull(),
  size: mysqlEnum("size", ["Small", "Medium", "Large"]),
  temperament: text("temperament"),
  vaccinated: mysqlEnum("vaccinated", ["yes", "no"]).notNull(),
  photo_url: varchar("photo_url", { length: 500 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// PlaydateRequests table - represents invitations between users
export const PlaydateRequests = mysqlTable("playdate_requests", {
  id: int("id").autoincrement().primaryKey(),
  sender_id: int("sender_id").notNull().references(() => User.id),
  receiver_id: int("receiver_id").notNull().references(() => User.id),
  dog_id: int("dog_id").notNull().references(() => Dog.id),
  date: int("date").notNull(),
  time: varchar("time", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["pending", "accepted", "declined"]).notNull().default("pending"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Messages table - for communication between users
export const Message = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  sender_id: int("sender_id").notNull().references(() => User.id),
  receiver_id: int("receiver_id").notNull().references(() => User.id),
  content: varchar("content", { length: 1000 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});