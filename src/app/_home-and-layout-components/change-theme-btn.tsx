"use client";

// UTILS
import useThemeStore from "~/components/stores/theme-store";

// COMPONENTS
import { Button } from "~/components/ui/button";

const ChangeThemeBtn = () => {
  const toggleDrawer = useThemeStore((state) => state.toggleDrawer);
  return (
    <Button variant={"secondary"} onClick={toggleDrawer}>
      Change Theme
    </Button>
  );
};
export default ChangeThemeBtn;
