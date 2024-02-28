"use client";

// LIBS
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FaPaintBrush } from "react-icons/fa";

// UTILS
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

// COMPONENTS
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { DivedToast } from "~/components/ui/toast";
import { useToast } from "~/components/ui/use-toast";

// COMP
const NameChangeDialog = () => {
  const [mouseOver, setMouseOver] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { data: session, update: updateSession } = useSession();
  const [nameInput, setNameInput] = useState(
    session?.user?.name ? session.user.name : "",
  );

  const editUser = api.user.edit.useMutation({
    onSuccess: async () => {
      await updateSession();
      setOpen(false);
      toast({
        action: (
          <DivedToast type="success">{"Name has been changed!"}</DivedToast>
        ),
      });
    },
    onError: (error) => {
      toast({
        action: (
          <DivedToast type="error">{`Error: ${error.message}`}</DivedToast>
        ),
      });
    },
  });

  const handleNameChange = () => {
    editUser.mutate({ name: nameInput });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          // NAME
          className="flex cursor-pointer items-center gap-8"
          onMouseEnter={() => setMouseOver(true)}
          onMouseLeave={() => setMouseOver(false)}
        >
          <h1
            className={cn(
              "border-b-4 border-transparent pb-3 text-5xl font-bold text-foreground",
              mouseOver ? "border-accent" : "",
            )}
          >{`Hello ${session?.user?.name}`}</h1>
          <FaPaintBrush
            className={cn(
              "mb-4 ml-4 text-3xl text-transparent",
              mouseOver ? "text-accent" : "",
            )}
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Change Name</DialogHeader>
        <div className="flex gap-6">
          <Input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <Button onClick={handleNameChange}>Change Name</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default NameChangeDialog;
