// LIBS
import { useRouter } from "next/navigation";
import { type FieldValues } from "react-hook-form";
import { z } from "zod";

// UITLS
import { timesToCompleteItems } from "~/app/_home-and-layout-components/forms/task-form-consts";
import useEditTaskFormStore from "~/components/stores/edit-task-form-store";
import { TASK_TIMEFRAMES } from "~/server/db/schema";
import { api } from "~/trpc/react";

// COMPONENTS
import { useMemo } from "react";
import { type UseFormReturn } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { DivedToast } from "~/components/ui/toast";
import { useToast } from "~/components/ui/use-toast";

// CONSTANTS
export const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 3 characters.",
  }),
  timesToComplete: z.string().min(1),
  timeframe: z.enum(TASK_TIMEFRAMES),
});

type EditTaskFormProps = {
  form: UseFormReturn<
    {
      title: string;
      timesToComplete: string;
      timeframe: "DAY" | "WEEK" | "FORTNIGHT" | "MONTH";
    } & FieldValues
  >;
};

// COMP
const EditTaskForm = ({ form }: EditTaskFormProps) => {
  const { toast } = useToast();
  const router = useRouter();

  // FORM STATES
  const setFormValue = form.setValue;
  // const setOpen = useEditTaskFormStore((state) => state.setOpen);
  const id = useEditTaskFormStore((state) => state.id);
  const title = useEditTaskFormStore((state) => state.title);
  const timeframe = useEditTaskFormStore((state) => state.timeframe);
  const timesToComplete = useEditTaskFormStore(
    (state) => state.timesToComplete,
  );

  // Propagate form values
  useMemo(() => {
    if (id) {
      setFormValue("title", title);
      setFormValue("timesToComplete", timesToComplete.toString());
      setFormValue("timeframe", timeframe);
    }
  }, [id, title, timesToComplete, timeframe, setFormValue]);

  const editTask = api.task.edit.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const validatedValues = {
      id,
      title: values.title,
      timesToComplete: parseInt(values.timesToComplete),
      timeframe: values.timeframe,
    };
    editTask.mutate(validatedValues);
    // setOpen(false);
    toast({
      action: (
        <DivedToast type="success">
          {`Task "${validatedValues.title}" editted successfully!`}
        </DivedToast>
      ),
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title" className="text-md">
                Username
              </FormLabel>
              <FormControl>
                <Input id="title" placeholder="Task Title" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between gap-4">
          <div className="flex w-1/2 justify-center">
            <FormField
              control={form.control}
              name="timesToComplete"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-md"># of times</FormLabel>
                  <Select
                    name="timesToComplete"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select # of times" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timesToCompleteItems.map((item) => (
                        <SelectItem
                          key={`timesToComplete-${item}`}
                          id={`timesToComplete-${item}`}
                          value={item.toString()}
                        >
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-1/2 justify-center">
            <FormField
              control={form.control}
              name="timeframe"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <h2 className="text-md">Per Timeframe</h2>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {TASK_TIMEFRAMES.map((item) => {
                        return (
                          <FormItem
                            key={`timeframe-${item.toLowerCase()}`}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem
                                id={`timeframe-${item.toLowerCase()}`}
                                value={item}
                              />
                            </FormControl>
                            <FormLabel
                              htmlFor={`timeframe-${item.toLowerCase()}`}
                              className="font-normal capitalize"
                            >
                              {item.toLowerCase()}
                            </FormLabel>
                          </FormItem>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button
          type="submit"
          className="rounded-xl px-8 py-6 text-xl font-bold"
        >
          Edit Task
        </Button>
      </form>
    </Form>
  );
};

export default EditTaskForm;
