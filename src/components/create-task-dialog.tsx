"use client";

// LIBS
import { useState } from "react";
import { signIn } from "next-auth/react";

// COMPONENTS
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import CreateTaskForm from "~/app/_home-and-layout-components/forms/create-task-form";

// FALLBACK - LOGIN BTN
export const LoginBtn = () => {
  return (
    <Button className="px-10 py-6 text-xl" onClick={() => signIn("google")}>
      Login
    </Button>
  );
};

// COMPONENT
const CreateTaskDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl px-8 py-6 text-lg font-bold lg:text-xl">
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg">Create Task</DialogTitle>
          <CreateTaskForm setOpen={setOpen} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
