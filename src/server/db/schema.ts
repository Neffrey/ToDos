import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

import type { Prettify, InferSqlTable } from "~/lib/type-utils";

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

// Table Type Defs
export type DbUser = Prettify<
  InferSqlTable<typeof users> & {
    accounts?: Account[];
    tasks?: Task[];
    comments?: Comment[];
    profilePictures?: ProfilePicture[];
  }
>;
export type Account = Prettify<InferSqlTable<typeof accounts>>;

export type ProfilePicture = Prettify<
  InferSqlTable<typeof profilePictures> & {
    user?: DbUser[];
  }
>;
export type Task = Prettify<
  InferSqlTable<typeof tasks> & {
    comments?: Partial<Comment>[];
    taskCompletions?: TaskCompletion[];
  }
>;
export type TaskCompletion = Prettify<
  InferSqlTable<typeof taskCompletions> & {
    task?: Partial<Task>[];
    user?: Partial<DbUser>[];
  }
>;
export type Comment = Prettify<
  InferSqlTable<typeof comments> & {
    task?: Partial<Task>[];
    user?: Partial<DbUser>;
  }
>;

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `todos_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  role: text("role", { enum: USER_ROLES }).default(USER_ROLES[1]),
  colorTheme: text("colorTheme", { enum: COLOR_THEMES }).default(
    COLOR_THEMES[5],
  ),
  ldTheme: text("ldTheme", { enum: ldThemes }).default(ldThemes[1]),
  showCompletedTasksDefault: boolean("showCompletedTasks").default(false),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  tasks: many(tasks),
  comments: many(comments),
  profilePictures: many(profilePictures),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
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
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
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
export const profilePictures = createTable(
  "profilePicture",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    url: text("url").notNull(),
    createdAt: timestamp("createdAt", {
      mode: "date",
    }).default(sql`CURRENT_TIMESTAMP`),
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

export const tasks = createTable(
  "task",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    title: text("title").notNull(),
    userId: text("user")
      .notNull()
      .references(() => users.id),
    timesToComplete: integer("timesToComplete").default(1).notNull(),
    timeframe: text("timeframe", { enum: TASK_TIMEFRAMES })
      .default(TASK_TIMEFRAMES[0])
      .notNull(),
    createdAt: timestamp("createdAt", {
      mode: "date",
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("createdAt", {
      mode: "date",
    })
      .default(sql`CURRENT_TIMESTAMP`)
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

export const taskCompletions = createTable(
  "taskCompletion",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    taskId: text("taskId")
      .notNull()
      .references(() => tasks.id),
    userId: text("user")
      .notNull()
      .references(() => users.id),
    timeframeCompletion: boolean("timeframeCompletion")
      .default(false)
      .notNull(),
    createdAt: timestamp("createdAt", {
      mode: "date",
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("createdAt", {
      mode: "date",
    })
      .default(sql`CURRENT_TIMESTAMP`)
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

export const comments = createTable(
  "comment",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    taskId: text("taskId")
      .notNull()
      .references(() => tasks.id),
    userId: text("user")
      .notNull()
      .references(() => users.id),
    content: text("content").notNull(),
    createdAt: timestamp("createdAt", {
      mode: "date",
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("createdAt", {
      mode: "date",
    })
      .default(sql`CURRENT_TIMESTAMP`)
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
