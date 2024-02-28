// LIBS
import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  int,
  mysqlEnum,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

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

export const USER_ROLES = ["ADMIN", "USER", "RESTRICTED"] as const;
export type UserRole = (typeof users.role.enumValues)[number];

export const TASK_TIMEFRAMES = ["DAY", "WEEK", "FORTNIGHT", "MONTH"] as const;
export type TaskTimeframe = (typeof tasks.timeframe.enumValues)[number];

// INSTANTIATE SCHEMA
export const createTable = mysqlTableCreator((name) => `todos_${name}`);

// User & Auth tables
export type DbUser = Prettify<
  InferSqlTable<typeof users> & {
    accounts?: Account[];
    tasks?: Task[];
    comments?: Comment[];
    profilePictures?: ProfilePicture[];
  }
>;
export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
  role: mysqlEnum("role", USER_ROLES).default(USER_ROLES[1]),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  tasks: many(tasks),
  comments: many(comments),
  profilePictures: many(profilePictures),
}));

export type Account = Prettify<InferSqlTable<typeof accounts>>;
export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
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

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
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
export const profilePictures = createTable(
  "profilePicture",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    userId: varchar("userId", { length: 255 }).notNull(),
    url: varchar("url", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
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
export const tasks = createTable(
  "task",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    title: varchar("title", { length: 256 }).notNull(),
    userId: varchar("user", { length: 255 }).notNull(),
    timesToComplete: int("timesToComplete").default(1).notNull(),
    timeframe: mysqlEnum("timeframe", TASK_TIMEFRAMES)
      .default(TASK_TIMEFRAMES[0])
      .notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow()
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
export const taskCompletions = createTable(
  "taskCompletion",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    taskId: bigint("taskId", { mode: "number" }).notNull(),
    userId: varchar("user", { length: 255 }).notNull(),
    timeframeCompletion: boolean("timeframeCompletion")
      .default(false)
      .notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow()
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
    // user?: Partial<DbUser>[];
  }
>;
export const comments = createTable(
  "comment",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    taskId: bigint("taskId", { mode: "number" }).notNull(),
    userId: varchar("user", { length: 255 }).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow()
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
