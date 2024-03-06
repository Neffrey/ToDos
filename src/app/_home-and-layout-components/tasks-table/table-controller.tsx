// LIBS
import resolveConfig from "tailwindcss/resolveConfig";

// UTILS
import { getServerAuthSession } from "~/server/auth";
import { isWithin } from "~/lib/time-compare";
import { type Task } from "~/server/db/schema";
import { api } from "~/trpc/server";
import twConfig from "../../../../tailwind.config";

// CONSTS
const twTheme = resolveConfig(twConfig);
export const screens = twTheme.theme?.screens;
export type Screens = typeof screens;

// COMPONENTS
import { columns } from "./columns";
import { DataTable } from "./data-table";

// HELPERS
const getData = async () => {
  const user = await getServerAuthSession();
  if (!user?.user) return [];
  return await api.task.getAll.query();
};

// COMP
const TasksTableController = async () => {
  const data = await getData();
  const now = new Date();

  const currentData = data.map((task) => {
    return {
      id: task.id,
      userId: task.userId,
      title: task.title,
      timesToComplete: task.timesToComplete,
      timeframe: task.timeframe,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      comments: task?.comments ? task.comments : undefined,
      taskCompletions: task?.taskCompletions
        ? task.taskCompletions
            .slice(-task.timesToComplete)
            .filter((completion) =>
              isWithin({
                timeframe: task.timeframe,
                oldDate: completion.createdAt,
                newDate: now,
              }),
            )
        : [],
    } satisfies Task;
  });

  return (
    <div className="flex w-full flex-col items-center justify-end px-8 xl:w-3/4">
      <DataTable columns={columns} data={currentData} screens={screens} />
    </div>
  );
};
export default TasksTableController;
