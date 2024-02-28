"use client";

// LIBS
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// UTILS
import { formSchema } from "~/app/_home-and-layout-components/forms/edit-task-form";
import { api } from "~/trpc/react";
import useEditTaskFormStore from "~/components/stores/edit-task-form-store";

//COMPONENTS
import { DialogContent } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import EditTaskForm from "~/app/_home-and-layout-components/forms/edit-task-form";
import AddCommentForm from "~/app/_home-and-layout-components/forms/add-comment-form";
import CommentList from "~/app/_home-and-layout-components/tasks-table/comment-list";
import { Separator } from "~/components/ui/separator";
import { type TaskCompletion } from "~/server/db/schema";

// COMP
const EditTaskDialogContent = () => {
  const router = useRouter();

  const id = useEditTaskFormStore((state) => state.id);
  const title = useEditTaskFormStore((state) => state.title);
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title,
      timeframe,
      timesToComplete: timesToComplete.toString(),
    },
  });

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

  return (
    <DialogContent className="max-h-[90vh] min-h-[90vh] min-w-[90vw] max-w-[90vw] bg-popover">
      <div className="flex items-center">
        <div className="flex w-1/2 flex-col">
          <div className="w-full pb-4 text-center text-lg font-semibold">
            Edit Task
          </div>
          <EditTaskForm form={form} />
          <div className="flex items-center justify-center">
            <Separator className="my-8 w-2/3 bg-popover-foreground" />
          </div>
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
          </div>
        </div>
        <Separator
          orientation="vertical"
          className="m-4 max-h-[95%] -translate-x-full bg-popover-foreground"
        />
        <div className="flex w-1/2 flex-col">
          <div className="w-full pb-4 text-center text-lg font-semibold">
            Comments
          </div>
          <AddCommentForm />
          <CommentList className="mt-4" />
        </div>
      </div>
    </DialogContent>
  );
};
export default EditTaskDialogContent;
