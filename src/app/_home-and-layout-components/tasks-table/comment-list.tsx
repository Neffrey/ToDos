"use client";

// LIBS
import RelativeTime from "@yaireo/relative-time";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FaUser } from "react-icons/fa";

// UTILS
import useEditTaskFormStore from "~/components/stores/edit-task-form-store";
import { cn } from "~/lib/utils";

// COMP
const CommentList = ({ className }: { className?: string }) => {
  const { data: session } = useSession();
  const relativeTime = new RelativeTime();

  const comments = [
    ...useEditTaskFormStore((state) => state.comments),
  ].reverse();

  const isOwnComment = (userId: string | undefined) => {
    if (!session?.user?.id) return false;
    return session?.user.id === userId;
  };

  return comments.length > 0 ? (
    <div
      className={cn(
        "custom-scrollbar flex max-h-[60vh] w-full flex-col gap-4 overflow-y-auto py-4",
        className,
      )}
    >
      {comments.map((comment) => {
        return (
          <div
            key={comment.id}
            className={cn(
              "relative flex gap-4",
              isOwnComment(comment.userId)
                ? "flex-row pr-6"
                : "flex-row-reverse pl-6",
            )}
          >
            <div
              className={cn(
                "relative flex w-full items-center justify-center rounded-xl",
                isOwnComment(comment.userId)
                  ? "mr-2 bg-secondary text-secondary-foreground"
                  : "ml-2 bg-primary text-primary-foreground",
              )}
            >
              {comment.content}
              <div
                // Triangle
                className={cn(
                  "absolute top-1/2 h-0 w-0 max-w-8 -translate-y-1/2 border-b-[8px] border-t-[8px] border-b-transparent border-t-transparent",

                  isOwnComment(comment.userId)
                    ? "left-full border-l-[12px] border-l-secondary"
                    : "right-full border-r-[12px] border-r-primary",
                )}
              />
            </div>
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                width={60}
                height={60}
                alt={`${
                  session?.user?.name ? session.user.name : "User"
                }'s profile picture`}
                className="rounded-full"
              />
            ) : (
              <div className="flex items-center justify-center">
                <FaUser />
              </div>
            )}
            <div className="flex flex-col items-center">
              {/* <div className="flex text-center text-sm">
                {comment. ? comment.userName : "Anonymous User"}
              </div> */}
              {comment?.updatedAt ? (
                <div className="flex text-center text-xs">
                  {relativeTime.from(comment.updatedAt)}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="flex items-center justify-center text-lg font-semibold ">
      No Comments
    </div>
  );
};
export default CommentList;
