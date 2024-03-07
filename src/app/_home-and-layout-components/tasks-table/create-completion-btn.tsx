"use client";

// LIBS
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa";

// UTILS
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";

// COMPONENTS
import { Button } from "~/components/ui/button";

// TYPES
import { type Task } from "~/server/db/schema";
type Props = {
  task: Task;
  className?: string;
};

const CreateCompletionBtn = ({ className, task }: Props) => {
  const router = useRouter();

  const createCompletion = api.completion.create.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleCreateCompletion = () => {
    createCompletion.mutate({
      taskId: task.id,
      timeframeCompletion:
        task.taskCompletions &&
        task.taskCompletions.length < task.timesToComplete - 1
          ? false
          : true,
    });
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Button className="min-w-max" onClick={handleCreateCompletion}>
        <FaCheck className="text" />
      </Button>
    </div>
  );
};

export default CreateCompletionBtn;
