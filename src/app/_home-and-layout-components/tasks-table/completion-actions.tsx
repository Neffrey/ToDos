//LIBS
import { useRouter } from "next/navigation";

// UTILS
import { api } from "~/trpc/react";
import useEditTaskFormStore from "~/components/stores/edit-task-form-store";
import { type TaskCompletion } from "~/server/db/schema";

//COMPONENTS
import { Button } from "~/components/ui/button";

// COMP
const CompletionActions = () => {
  const router = useRouter();

  const id = useEditTaskFormStore((state) => state.id);
  const timesToComplete = useEditTaskFormStore(
    (state) => state.timesToComplete,
  );
  const taskCompletions = useEditTaskFormStore(
    (state) => state.taskCompletions,
  );
  const setTaskCompletions = useEditTaskFormStore(
    (state) => state.setTaskCompletions,
  );
  const timeframe = useEditTaskFormStore((state) => state.timeframe);
  const setOpen = useEditTaskFormStore((state) => state.setOpen);

  const createCompletion = api.completion.createWithReturn.useMutation({
    onSuccess: (data) => {
      setTaskCompletions([...taskCompletions, data as TaskCompletion]);
      router.refresh();
    },
  });

  const deleteCompletion = api.completion.delete.useMutation({
    onSuccess: () => {
      setTaskCompletions(taskCompletions.slice(0, -1));
      router.refresh();
    },
  });

  const deleteTask = api.task.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      setOpen(false);
    },
  });

  const handleCreateCompletion = () => {
    createCompletion.mutate({
      taskId: id,
      timeframeCompletion:
        taskCompletions.length < timesToComplete - 1 ? false : true,
    });
  };

  const handleDeleteCompletion = () => {
    deleteCompletion.mutate({
      taskId: id,
    });
  };

  const handleDeleteTask = () => {
    deleteTask.mutate({
      taskId: id,
    });
  };

  return (
    <>
      <p className="w-full text-center">
        {`${
          taskCompletions.length
        } / ${timesToComplete} completions per ${timeframe.toLowerCase()}`}
      </p>
      <div className="p-4" />
      <div className="flex items-center justify-center gap-4">
        <Button onClick={handleCreateCompletion} variant={"secondary"}>
          Mark Completed
        </Button>
        <Button onClick={handleDeleteCompletion} variant={"destructive"}>
          Unmark Completed
        </Button>
        <Button onClick={handleDeleteTask} variant={"destructive"}>
          Delete Task
        </Button>
      </div>
    </>
  );
};

export default CompletionActions;
