"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";
import Nav from "./components/navbar";
import { SessionProvider } from "next-auth/react";
import { SemesterProvider } from "./context/SemesterContext";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <SessionProvider>
          <SemesterProvider>{children}</SemesterProvider>
        </SessionProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
