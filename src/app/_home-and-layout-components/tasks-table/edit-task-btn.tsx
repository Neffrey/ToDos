"use client";

// UTILS
import { cn } from "~/lib/utils";
import useEditTaskFormStore from "~/components/stores/edit-task-form-store";

// COMPONENTS
import { FaPaintBrush } from "react-icons/fa";
import { Button } from "~/components/ui/button";

// TYPES
import { type Task } from "~/server/db/schema";

// COMP
const EditTaskBtn = ({ className }: { className?: string; task: Task }) => {
  const setOpen = useEditTaskFormStore((s) => s.setOpen);

  return (
    <Button
      className={cn("flex items-center justify-center", className)}
      onClick={() => setOpen(true)}
    >
      <FaPaintBrush />
    </Button>
  );
};

export default EditTaskBtn;
