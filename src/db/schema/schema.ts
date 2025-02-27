import { boolean, integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    email: varchar({ length: 255 }).unique().notNull(),
    password: varchar({ length: 255 }).notNull(),
    firstName: varchar({ length: 100 }).notNull(),
    lastName: varchar({ length: 100 }).notNull(),
    age: integer().notNull(),
    weight: integer().notNull(),
    height: integer().notNull(),
    gender: varchar({ length: 10 }).notNull(),
    isAdmin: boolean().notNull().default(false),
});

export const workouts = pgTable("workouts", {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid().notNull(),
    date: varchar({ length: 10 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
    completed: boolean().notNull().default(false),
});
