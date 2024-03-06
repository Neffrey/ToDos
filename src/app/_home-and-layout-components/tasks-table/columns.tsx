"use client";

// COMPONENTS
import CreateCompletionBtn from "~/app/_home-and-layout-components/tasks-table/create-completion-btn";
import TCsPerTimeframe from "./tcs-per-timeframe";
import EditTaskBtn from "./edit-task-btn";
import DataCell from "./data-cell";

// TYPES
import { type ColumnDef } from "@tanstack/react-table";
import { type Task } from "~/server/db/schema";

// COLUMNS
export const columns: ColumnDef<Task>[] = [
  {
    // Title: Screen lg+
    id: "title",
    header: () => {
      return <div className="w-full justify-start lg:w-[300px]">Title</div>;
    },
    cell: ({ row }) => {
      return (
        <DataCell data={row.original} className="flex-grow">
          {row.original.title}
        </DataCell>
      );
    },
  },
  {
    // # of current completions
    id: "completions",
    header: () => {
      return <div className="justify-center px-2">Completions</div>;
    },
    cell: ({ row }) => {
      return (
        <DataCell className="justify-center" data={row.original}>
          <TCsPerTimeframe task={row.original} />
        </DataCell>
      );
    },
  },
  {
    // Comments: Screen lg+
    id: "comments",
    header: () => {
      return <div className="justify-center px-2">Comments</div>;
    },
    cell: ({ row }) => {
      return (
        <DataCell data={row.original} className="min-w-max justify-center">
          {`${row.original.comments?.length.toString()} comments`}
        </DataCell>
      );
    },
  },
  {
    // Edit Task: Screen lg+
    id: "edit",
    header: () => {
      return <div className="justify-center px-2">Edit</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="justify-center">
          <EditTaskBtn task={row.original} />
        </div>
      );
    },
  },
  {
    // Mark task complete: all screens
    id: "complete",
    header: () => {
      return <div className="flex justify-end px-2">Complete</div>;
    },
    cell: ({ row }) => {
      return (
        <CreateCompletionBtn className="justify-end px-4" task={row.original} />
      );
    },
  },
];
