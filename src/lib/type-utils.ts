/***********  TYPE UTILS *********/

// LIBS
import { type SQL } from "drizzle-orm/sql";
// import { type MySqlColumn } from "drizzle-orm/mysql-core";
import { type SQLiteColumn } from "drizzle-orm/sqlite-core";

// PRETTIFY
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & object;

// SQL UTILS
type ExtractColumn<T extends SQLiteColumn> =
  T extends SQLiteColumn<infer U>
    ? U extends { notNull: true }
      ? U["data"]
      : U["data"] | null
    : never;

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- used in type inference
type ExtractSqlType<T> =
  T extends SQLiteColumn<infer U, object>
    ? ExtractColumn<T>
    : T extends SQL.Aliased<infer V>
      ? V
      : never;

type OmitNevers<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K] };

type InferTableWithDrizzleValues<T> = {
  [K in keyof T as T[K] extends never ? never : K]: ExtractSqlType<T[K]>;
};

export type InferSqlTable<T> = Prettify<
  OmitNevers<InferTableWithDrizzleValues<T>>
>;
