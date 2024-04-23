"use client";

import { Button } from "~/components/ui/button";

const AuthTest = () => {
  return (
    <div>
      <h1>Auth Test</h1>
      <Button onClick={() => console.log("LOGIN CLICKED")}>Login</Button>
    </div>
  );
};

export default AuthTest;
