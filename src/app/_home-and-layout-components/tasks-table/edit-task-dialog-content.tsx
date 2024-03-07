"use client";

//LIBS
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";

// UTILS
import { formSchema } from "~/app/_home-and-layout-components/forms/edit-task-form";
import useMediaQuery from "~/components/hooks/use-media-query";
import useEditTaskFormStore from "~/components/stores/edit-task-form-store";

//COMPONENTS
import EditTaskForm from "~/app/_home-and-layout-components/forms/edit-task-form";
import { DialogContent } from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { type Screens } from "./table-controller";
import TaskComments from "./task-comments";
import CompletionActions from "./completion-actions";

// COMP
const EditTaskDialogContent = ({ screens }: { screens: Screens }) => {
  const isLg = useMediaQuery(`(min-width: ${screens?.lg})`);

  const title = useEditTaskFormStore((state) => state.title);
  const timesToComplete = useEditTaskFormStore(
    (state) => state.timesToComplete,
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

  return (
    <DialogContent className="max-h-[90vh] min-h-[90vh] min-w-[90vw] max-w-[90vw] bg-popover">
      {isLg ? (
        <div className="flex">
          <div className="flex w-full flex-col lg:w-1/2">
            <div className="w-full pb-4 text-center text-lg font-semibold">
              Edit Task
            </div>
            <EditTaskForm form={form} />
            <Separator className="my-8 w-2/3 bg-popover-foreground" />
            <CompletionActions />
          </div>
          <Separator
            orientation="vertical"
            className="m-4 max-h-[95%] -translate-x-full bg-popover-foreground"
          />
          <div className="flex w-full flex-col lg:w-1/2">
            <div className="w-full pb-4 text-center text-lg font-semibold">
              Comments
            </div>
            <TaskComments />
          </div>
        </div>
      ) : (
        <Tabs defaultValue="edit">
          <TabsList>
            <TabsTrigger value="edit">Edit Task</TabsTrigger>
            <TabsTrigger value="completions">Completions</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <EditTaskForm form={form} />
          </TabsContent>
          <TabsContent value="completions">
            <CompletionActions />
          </TabsContent>
          <TabsContent value="comments">
            <TaskComments />
          </TabsContent>
        </Tabs>
      )}
    </DialogContent>
  );
};
export default EditTaskDialogContent;
