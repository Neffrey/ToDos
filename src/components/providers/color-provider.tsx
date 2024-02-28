"use client";

import * as React from "react";
import { themeChange } from "theme-change";

// TYPES
type ColorProviderProps = {
  children: React.ReactNode;
};

const ColorProvider = ({ children }: ColorProviderProps) => {
  React.useEffect(() => {
    themeChange(false);
    // false parameter is required for react project
  }, []);

  return children;
};

export default ColorProvider;
