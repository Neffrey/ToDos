// UTILS
import { cn } from "~/lib/utils";
import useEditTaskFormStore from "~/components/stores/edit-task-form-store";

// TYPES
import { type ReactNode } from "react";
import { type Task } from "~/server/db/schema";

type DataCellProps = {
  children: ReactNode;
  className?: string;
  data: Task;
};

// COMP
const DataCell = ({ children, className, data }: DataCellProps) => {
  // FORM STATES
  const setOpen = useEditTaskFormStore((state) => state.setOpen);
  const setId = useEditTaskFormStore((state) => state.setId);
  const setTitle = useEditTaskFormStore((state) => state.setTitle);
  const setTimesToComplete = useEditTaskFormStore(
    (state) => state.setTimesToComplete,
  );
  const setTaskCompletions = useEditTaskFormStore(
    (state) => state.setTaskCompletions,
  );
  const setTimeframe = useEditTaskFormStore((state) => state.setTimeframe);
  const setComments = useEditTaskFormStore((state) => state.setComments);

  const handleOpen = () => {
    // SET FORM STATES
    setId(data.id);
    setTitle(data.title);
    setTimesToComplete(data.timesToComplete);
    setTimeframe(data.timeframe);
    setOpen(true);
    setComments(data?.comments ? data.comments : []);
    setTaskCompletions(
      data?.taskCompletions
        ? data.taskCompletions.slice(-data.timesToComplete)
        : [],
    );
  };

  return (
    <div
      className={cn(`flex h-full w-full cursor-pointer p-4`, className)}
      onClick={() => handleOpen()}
    >
      {children}
    </div>
  );
};
export default DataCell;
