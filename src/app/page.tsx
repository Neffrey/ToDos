//LIBS
import { unstable_noStore as noStore } from "next/cache";

// COMPONENTS
import CreateTaskDialog, { LoginBtn } from "~/components/create-task-dialog";
import ProtectedContent from "~/components/protectedContent";
import TaskTableController from "~/app/_home-and-layout-components/tasks-table/table-controller";

const Home = async () => {
  noStore();

  return (
    <div
      // HERO ROW
      className="flex w-full flex-wrap items-center justify-around gap-12 bg-gradient-to-br from-background to-background/50 md:justify-center "
      // md:px-20 px-4 py-16
    >
      <div className="flex w-full flex-col gap-5 md:w-1/2 lg:w-1/3">
        <h1 className="w-full text-center text-5xl font-extrabold tracking-wider text-foreground sm:text-[5rem]">
          nToDos
        </h1>
        <h2 className="w-full text-center text-xl tracking-wider text-foreground">
          Just a lil todo app by Neffrey
        </h2>
      </div>
      <div className="flex w-full items-center justify-center">
        <ProtectedContent
          authedRoles={["ADMIN", "USER"]}
          fallback={<LoginBtn />}
        >
          <CreateTaskDialog />
        </ProtectedContent>
      </div>
      <ProtectedContent authedRoles={["ADMIN", "USER", "RESTRICTED"]}>
        <TaskTableController />
      </ProtectedContent>
    </div>
  );
};

export default Home;
