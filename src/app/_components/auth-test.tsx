"use client";

// LIBS
import { signIn } from "next-auth/react";

// COMPONENTS
import ProtectedContent from "~/components/protectedContent";
import { Button } from "~/components/ui/button";

const AuthTest = () => {
  return (
    <div>
      <h1>Auth Test</h1>
      <ProtectedContent
        fallback={<Button onClick={() => signIn("google")}>Login</Button>}
      >
        <div>SUCCESSFULLY LOGGED IN</div>
      </ProtectedContent>
    </div>
  );
};

export default AuthTest;
