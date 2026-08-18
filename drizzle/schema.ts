import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, uniqueIndex } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// `player_progress` is a legacy table with an incompatible per-player JSON shape.
// Keep it untouched; the current game stores one deterministic row per stage and mode.
export const playerStageProgress = mysqlTable("player_stage_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  stageId: int("stageId").notNull(),
  mode: mysqlEnum("mode", ["build", "fix"]).notNull(),
  completed: int("completed").notNull().default(0),
  score: int("score").notNull().default(0),
  attempts: int("attempts").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userStageMode: uniqueIndex("player_stage_progress_user_stage_mode").on(table.userId, table.stageId, table.mode),
}));

export type PlayerStageProgress = typeof playerStageProgress.$inferSelect;
export type InsertPlayerStageProgress = typeof playerStageProgress.$inferInsert;
