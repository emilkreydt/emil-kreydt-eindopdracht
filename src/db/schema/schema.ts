
import { boolean, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const workouts = pgTable("workouts", {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    isGood: boolean().notNull().default(false),
});

