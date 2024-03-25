"use client";

// LIBRARIES
import { create } from "zustand";

// UTILS
import { TASK_TIMEFRAMES } from "~/server/db/schema";

// TYPES
import {
  type TaskTimeframe,
  type Comment,
  type TaskCompletion,
} from "~/server/db/schema";

export interface EditTaskFormStoreType {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
  setId: (id: string) => void;
  title: string;
  setTitle: (title: string) => void;
  timesToComplete: number;
  setTimesToComplete: (timesToComplete: number) => void;
  taskCompletions: TaskCompletion[];
  setTaskCompletions: (taskCompletions: TaskCompletion[]) => void;
  timeframe: TaskTimeframe;
  setTimeframe: (timeframe: TaskTimeframe) => void;
  comments: Partial<Comment>[];
  setComments: (comments: Partial<Comment>[]) => void;
}

const useEditTaskFormStore = create<EditTaskFormStoreType>((set) => ({
  open: false,
  setOpen: (open) =>
    set(() => ({
      open,
    })),
  id: "",
  setId: (id) =>
    set(() => ({
      id,
    })),
  title: "",
  setTitle: (title) =>
    set(() => ({
      title,
    })),
  timesToComplete: 0,
  setTimesToComplete: (timesToComplete) =>
    set(() => ({
      timesToComplete,
    })),
  taskCompletions: [],
  setTaskCompletions: (taskCompletions) =>
    set(() => ({
      taskCompletions,
    })),
  timeframe: TASK_TIMEFRAMES[0],
  setTimeframe: (timeframe) =>
    set(() => ({
      timeframe,
    })),
  comments: [],
  setComments: (comments) => set(() => ({ comments })),
}));

export default useEditTaskFormStore;
