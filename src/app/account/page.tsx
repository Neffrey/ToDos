"use client";

// LIBS
import { signOut } from "next-auth/react";
import { Suspense, useState } from "react";

// UTILS
import { api } from "~/trpc/react";

// COMPONENTS
import ProtectedContent from "~/components/protectedContent";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import NameChangeDialog from "./_components/dialogs/name-change-dialog";
import ProfPicChangeDialog from "./_components/dialogs/prof-pic-change-dialog";
import ThemePicker from "./_components/theme-picker";
import UnauthedLogin from "./_components/unauthed-login";
import { Separator } from "~/components/ui/separator";

// COMP
const AccountPage = () => {
  const [showCompletedSetting, setShowCompletedSetting] = useState(false);

  const editUser = api.user.edit.useMutation();

  const handleShowCompletedSettingChange = () => {
    editUser.mutate({ showCompletedSetting: !showCompletedSetting });
    setShowCompletedSetting(!showCompletedSetting);
  };

  return (
    <Suspense>
      <ProtectedContent
        authedRoles={["ADMIN", "USER", "RESTRICTED"]}
        fallback={<UnauthedLogin />}
      >
        <div className="pt-12" />
        <div
          // HERO ROW
          className="flex h-full w-full flex-col flex-wrap items-center justify-center gap-20 bg-background text-foreground md:justify-center"
        >
          <div
            // DETAILS
            className="flex items-center justify-around gap-6"
          >
            <div className="flex flex-col items-center justify-center gap-6">
              <NameChangeDialog />
            </div>

            <ProfPicChangeDialog />
          </div>

          <div
            // SETTINGS
            className="flex w-1/2 flex-col items-center justify-center gap-6"
          >
            <h2 className="text-3xl font-semibold text-foreground">Settings</h2>
            <div
              // SHOW COMPLETED TODOS
              className="flex w-full items-center justify-between gap-6"
            >
              <h3 className="text-xl font-semibold text-foreground">
                Show Completed Todos by Default
              </h3>
              <Switch
                checked={showCompletedSetting}
                onCheckedChange={handleShowCompletedSettingChange}
                className="bg-neutral data-[state=checked]:bg-accent data-[state=unchecked]:bg-foreground"
              />
            </div>

            <Separator className="my-6 w-1/2 bg-foreground/50" />

            <div
              // THEME
              className="flex w-full flex-col items-center gap-6"
            >
              <h3 className="text-xl font-semibold text-foreground">Theme</h3>
              <ThemePicker />
            </div>
          </div>

          <div
            // LOGOUT
            className="flex w-full items-center justify-center gap-6 align-middle"
          >
            <Button className="px-10 py-6 text-xl" onClick={() => signOut()}>
              Log Out
            </Button>
          </div>
          <div className="pt-10" />
        </div>
      </ProtectedContent>
    </Suspense>
  );
};
export default AccountPage;
