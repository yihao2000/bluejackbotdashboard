"use client";
import Image from "next/image";
import Nav from "./components/navbar";
import { Box, Button, useColorMode } from "@chakra-ui/react";
import { useEffect } from "react";

export default function Home() {
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
