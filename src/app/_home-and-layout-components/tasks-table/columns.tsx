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
    header: () => {
      return <div className="flex w-[300px] justify-start">Title</div>;
    },
    id: "title",
    cell: ({ row }) => {
      return (
        <DataCell data={row.original} className="flex-grow">
          {row.original.title}
        </DataCell>
      );
    },
  },

  {
    id: "#",
    header: () => {
      return <div className="flex justify-center px-2">#</div>;
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
    id: "per",
    header: () => {
      return <div className="flex justify-center px-2">per</div>;
    },
    cell: ({ row }) => {
      return <DataCell data={row.original}>&nbsp;</DataCell>;
    },
  },
  {
    id: "timeframe",
    header: () => {
      return <div className="flex justify-center px-2">Timeframe</div>;
    },
    cell: ({ row }) => {
      return (
        <DataCell data={row.original} className="min-w-max justify-center">
          {row.original.timeframe.toLowerCase()}
        </DataCell>
      );
    },
  },
  {
    id: "comments",
    header: () => {
      return <div className="flex justify-center px-2">Comments</div>;
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
    id: "edit",
    header: () => {
      return <div className="flex justify-center px-2">Edit</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <EditTaskBtn task={row.original} />
        </div>
      );
    },
  },
  {
    header: () => {
      return <div className="flex justify-end px-2">Complete</div>;
    },
    id: "complete",
    cell: ({ row }) => {
      return (
        <CreateCompletionBtn className="justify-end px-4" task={row.original} />
      );
    },
  },
];
