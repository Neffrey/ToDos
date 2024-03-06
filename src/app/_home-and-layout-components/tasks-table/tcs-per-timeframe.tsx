"use client";

import { FaCheck } from "react-icons/fa";
// LIBS

// UTILS

// COMPONENTS

// TYPES
import { type Task } from "~/server/db/schema";
type Props = {
  task: Task;
};

const TCsPerTimeframe = ({ task }: Props) => {
  const currentCompletions = task?.taskCompletions
    ? task.taskCompletions.slice(-task.timesToComplete)
    : [];

  return (
    <div className="flex items-center justify-center">
      {currentCompletions.some((e) => e.timeframeCompletion === true) ? (
        <FaCheck className="text-primary" />
      ) : (
        `${currentCompletions.length} / ${task.timesToComplete} per ${task.timeframe.toLowerCase()}`
      )}
    </div>
  );
};

export default TCsPerTimeframe;
