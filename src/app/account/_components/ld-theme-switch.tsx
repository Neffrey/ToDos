"use client";

import { Button } from "~/components/ui/button";
import { useTheme } from "next-themes";
import UseOnRender from "~/components/hooks/use-on-render";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-10">
      <UseOnRender>
        <h3>The current LD theme is: {theme}</h3>
      </UseOnRender>
      <div className="flex gap-10">
        <Button variant={"default"} onClick={() => setTheme("light")}>
          Light
        </Button>
        <Button variant={"secondary"} onClick={() => setTheme("dark")}>
          Dark
        </Button>
      </div>
    </div>
  );
};
export default ThemeSwitch;
