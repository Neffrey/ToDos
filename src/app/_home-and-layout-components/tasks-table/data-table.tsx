"use client";

// LIBS
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";

// UTILS
import useEditTaskFormStore from "~/components/stores/edit-task-form-store";

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- used in type inference
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<Task, TValue>[];
  data: Task[];
}

// COMP
export const DataTable = <TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) => {
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

  const table = useReactTable({
    columns,
    data: dataWithCompletedFilter,
    getCoreRowModel: getCoreRowModel(),
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
      <div className="w-full rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
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
