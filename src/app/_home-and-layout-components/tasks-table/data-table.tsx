"use client";

// LIBS
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { useLayoutEffect, useMemo, useState } from "react";

// UTILS
import useEditTaskFormStore from "~/components/stores/edit-task-form-store";
import { type Screens } from "./table-controller";

import useMediaQuery from "~/components/hooks/use-media-query";

// COMPONENTS
import EditTaskDialogContent from "~/app/_home-and-layout-components/tasks-table/edit-task-dialog-content";
import { Checkbox } from "~/components/ui/checkbox";
import { Dialog } from "~/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

// TYPES
import { type Task } from "~/server/db/schema";

interface NewDataTableProps {
  columns: ColumnDef<Task>[];
  data: Task[];
  screens: Screens;
}

// COMP
export const DataTable = ({ columns, data, screens }: NewDataTableProps) => {
  const { data: session } = useSession();
  const [showCompletedTasks, setShowCompletedTasks] = useState(
    session?.user?.showCompletedTasksDefault ? true : false,
  );

  const open = useEditTaskFormStore((state) => state.open);
  const setOpen = useEditTaskFormStore((state) => state.setOpen);

  const dataWithCompletedFilter = useMemo(() => {
    if (showCompletedTasks) return data;
    return data.filter((task) =>
      task?.taskCompletions
        ? !task?.taskCompletions.some(
            (completion) => completion.timeframeCompletion === true,
          )
        : true,
    );
  }, [showCompletedTasks, data]);

  const isLg = useMediaQuery(`(min-width: ${screens?.lg})`);
  const [columnVisibility, setColumnVisibility] = useState({
    comments: isLg ? true : false,
    edit: isLg ? true : false,
  });

  useLayoutEffect(() => {
    setColumnVisibility({
      comments: isLg ? true : false,
      edit: isLg ? true : false,
    });
  }, [isLg]);

  const table = useReactTable({
    columns,
    data: dataWithCompletedFilter,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
    },
  });

  return (
    <>
      <div className="flex w-full items-center justify-between gap-32 pb-8">
        <h2 className="text-3xl uppercase tracking-wider">ToDo Table</h2>
        <label className="flex items-center justify-center gap-5">
          Show Completed ToDos
          <Checkbox
            checked={showCompletedTasks}
            onCheckedChange={() => setShowCompletedTasks(!showCompletedTasks)}
          />
        </label>
      </div>
      <div className="w-full overflow-hidden rounded-md border-2 border-solid border-foreground/30">
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="bg-primary text-primary-foreground"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <Dialog
            // DIALOG
            open={open}
            onOpenChange={setOpen}
          >
            <EditTaskDialogContent />
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, i) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`${i % 2 === 0 ? "bg-secondary/30" : "bg-secondary/50"} border-foreground/30 hover:bg-secondary`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {`No Tasks yet :(`}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Dialog>
        </Table>
      </div>
    </>
  );
};
