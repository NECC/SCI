"use client";

import { NextUIProvider } from "@nextui-org/react";

const NextUI = ({ children }: { children: React.ReactNode }) => {
  return <NextUIProvider>{children}</NextUIProvider>;
};

export default NextUI;
