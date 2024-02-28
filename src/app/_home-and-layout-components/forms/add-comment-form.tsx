"use client";

// LIBS
import { useState } from "react";
import { useRouter } from "next/navigation";

// UTILS
import useEditTaskFormStore from "~/components/stores/edit-task-form-store";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

// COMPONENTS
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { Textarea } from "~/components/ui/textarea";

// COMP
const AddCommentForm = ({ className }: { className?: string }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [newCommentInput, setNewCommentInput] = useState("");

  const taskId = useEditTaskFormStore((state) => state.id);
  const setComments = useEditTaskFormStore((state) => state.setComments);

  const createComment = api.comment.create.useMutation({
    onSuccess: (data) => {
      console.log("create comment success - data: ", data);
      toast({ title: "Comment created." });
      setNewCommentInput("");
      setComments(data);
      router.refresh();
    },
    onError: (error) => {
      toast({ title: "Comment failed: " + error.message });
    },
  });

  return (
    <div className="flex items-center justify-between gap-4">
      <Textarea
        placeholder="Add comment"
        value={newCommentInput}
        onChange={(e) => setNewCommentInput(e.target.value)}
        className="resize-none"
      />
      <Button
        className={cn(
          "flex h-max min-h-max min-w-fit items-center justify-center px-6 py-4",
          className,
        )}
        onClick={() =>
          createComment.mutate({ taskId, content: newCommentInput })
        }
      >
        Add Comment
      </Button>
    </div>
  );
};

export default AddCommentForm;
