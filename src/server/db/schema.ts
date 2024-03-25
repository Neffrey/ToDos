// LIBS
import { relations, sql } from "drizzle-orm";
import {
  text,
  integer,
  sqliteTable,
  primaryKey,
  index,
} from "drizzle-orm/sqlite-core";
import { type AdapterAccount } from "next-auth/adapters";
import { nanoid } from "nanoid/non-secure";

// UTILS
import { type InferSqlTable, type Prettify } from "~/lib/type-utils";

// CONSTS
export const COLOR_THEMES = [
  "bland",
  "bumblebee",
  "coffee",
  "cupcake",
  "forest",
  "galaxy",
  "lavender",
  "valentine",
] as const;
export type ColorTheme = (typeof COLOR_THEMES)[number];

export const ldThemes = ["light", "dark"] as const;
export type LdTheme = (typeof ldThemes)[number];

export const USER_ROLES = ["ADMIN", "USER", "RESTRICTED"] as const;
export type UserRole = (typeof users.role.enumValues)[number];

export const TASK_TIMEFRAMES = ["DAY", "WEEK", "FORTNIGHT", "MONTH"] as const;
export type TaskTimeframe = (typeof tasks.timeframe.enumValues)[number];

// User & Auth tables
export type DbUser = Prettify<
  InferSqlTable<typeof users> & {
    accounts?: Account[];
    tasks?: Task[];
    comments?: Comment[];
    profilePictures?: ProfilePicture[];
  }
>;
export const users = sqliteTable("user", {
  // id: text("id").notNull().primaryKey(),
  id: text("id").notNull().primaryKey().default(nanoid(12)),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  image: text("image"),
  role: text("role", { enum: USER_ROLES }).default(USER_ROLES[1]),
  colorTheme: text("colorTheme", { enum: COLOR_THEMES }).default(
    COLOR_THEMES[5],
  ),
  ldTheme: text("ldTheme", { enum: ldThemes }).default(ldThemes[1]),
  showCompletedTasksDefault: integer("showCompletedTasks", {
    mode: "boolean",
  }).default(false),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  tasks: many(tasks),
  comments: many(comments),
  profilePictures: many(profilePictures),
}));

export type Account = Prettify<InferSqlTable<typeof accounts>>;
export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId").notNull(),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at", { mode: "timestamp_ms" }),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("accounts_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = sqliteTable(
  "session",
  {
    // sessionToken: text("sessionToken").notNull().primaryKey(),
    sessionToken: text("sessionToken").notNull().primaryKey().default(nanoid()),
    userId: text("userId").notNull(),
    expires: text("expires").notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: text("expires").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// CONTENT TABLES
export type ProfilePicture = Prettify<
  InferSqlTable<typeof profilePictures> & {
    user?: DbUser[];
  }
>;
export const profilePictures = sqliteTable(
  "profilePicture",
  {
    // id: text("id").primaryKey(),
    id: text("id").primaryKey().default(nanoid(12)),
    userId: text("userId").notNull(),
    url: text("url").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (profilePicture) => ({
    userIdIdx: index("userId_Idx").on(profilePicture.userId),
    idIndex: index("id_Idx").on(profilePicture.id),
  }),
);

export const profilePictureRelations = relations(
  profilePictures,
  ({ one }) => ({
    userId: one(users, {
      fields: [profilePictures.userId],
      references: [users.id],
    }),
  }),
);

export type Task = Prettify<
  InferSqlTable<typeof tasks> & {
    comments?: Partial<Comment>[];
    taskCompletions?: TaskCompletion[];
  }
>;
export const tasks = sqliteTable(
  "task",
  {
    // id: text("id").primaryKey(),
    id: text("id").primaryKey().default(nanoid(12)),
    title: text("title").notNull(),
    userId: text("user").notNull(),
    timesToComplete: integer("timesToComplete").default(1).notNull(),
    timeframe: text("timeframe", { enum: TASK_TIMEFRAMES })
      .default(TASK_TIMEFRAMES[0])
      .notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .default(sql`CURRENT_TIMESTAMP`)
      // .onUpdateNow()
      .notNull(),
  },
  (task) => ({
    createdByIdIdx: index("createdById_idx").on(task.userId),
    nameIndex: index("name_idx").on(task.title),
  }),
);

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  userId: one(users, { fields: [tasks.userId], references: [users.id] }),
  taskCompletions: many(taskCompletions),
  comments: many(comments),
}));

export type TaskCompletion = Prettify<
  InferSqlTable<typeof taskCompletions> & {
    task?: Partial<Task>[];
    user?: Partial<DbUser>[];
  }
>;
export const taskCompletions = sqliteTable(
  "taskCompletion",
  {
    id: text("id").primaryKey().default(nanoid(12)),
    taskId: text("taskId").default(nanoid(12)),
    // id: text("id").primaryKey(),
    // taskId: text("taskId"),
    userId: text("user").notNull(),
    timeframeCompletion: integer("timeframeCompletion", { mode: "boolean" })
      .default(false)
      .notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .default(sql`CURRENT_TIMESTAMP`)
      // .onUpdateNow()
      .notNull(),
  },
  (taskCompletion) => ({
    tcompIdIdx: index("tcompId_idx").on(taskCompletion.id),
  }),
);

export const tcRelations = relations(taskCompletions, ({ one }) => ({
  task: one(tasks, {
    fields: [taskCompletions.taskId],
    references: [tasks.id],
  }),
  userId: one(users, {
    fields: [taskCompletions.userId],
    references: [users.id],
  }),
}));

export type Comment = Prettify<
  InferSqlTable<typeof comments> & {
    task?: Partial<Task>[];
    user?: Partial<DbUser>;
  }
>;
export const comments = sqliteTable(
  "comment",
  {
    id: text("id").primaryKey().default(nanoid(12)),
    taskId: text("taskId").notNull().default(nanoid(12)),
    // id: text("id").primaryKey(),
    // taskId: text("taskId").notNull(),
    userId: text("user").notNull(),
    content: text("content").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .default(sql`CURRENT_TIMESTAMP`)
      // .onUpdateNow()
      .notNull(),
  },
  (comment) => ({
    taskIdIdx: index("taskId_idx").on(comment.taskId),
  }),
);

export const commentsRelations = relations(comments, ({ one }) => ({
  task: one(tasks, { fields: [comments.taskId], references: [tasks.id] }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));
