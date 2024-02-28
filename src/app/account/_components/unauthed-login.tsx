// LIBS
import { signIn } from "next-auth/react";

// COMPONENTS
import { Button } from "~/components/ui/button";

// COMP
const UnauthedLogin = () => {
  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-10">
      <h1 className="text-5xl font-bold text-primary-foreground">
        Please Login
      </h1>
      <Button onClick={() => signIn()} size={"lg"}>
        Login
      </Button>
    </div>
  );
};
export default UnauthedLogin;
