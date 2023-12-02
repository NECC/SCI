"use client";

import { NextUIProvider } from "@nextui-org/react";

const NextUI = ({ children }) => {
  return (
    <NextUIProvider>{children}</NextUIProvider>
  );
};


export default NextUI;