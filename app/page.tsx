"use client";
import Image from "next/image";
import Nav from "./components/navbar";
import { Box, Button, useColorMode } from "@chakra-ui/react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useSemester } from "./context/SemesterContext";

export default function Home() {
  const session = useSession();

  console.log(session);
  return (
    <>
      <Nav>
        <main>
          <Box bgColor="#40a9dd">
            <Button color="secondary.50">Test</Button>
          </Box>
        </main>
      </Nav>
    </>
  );
}
