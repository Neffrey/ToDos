// LIBS

// COMPONENTS
import AddCommentForm from "~/app/_home-and-layout-components/forms/add-comment-form";
import CommentList from "~/app/_home-and-layout-components/tasks-table/comment-list";

// COMP
const TaskComments = () => {
  return (
    <>
      <AddCommentForm />
      <CommentList className="mt-4" />
    </>
  );
};

export default TaskComments;
