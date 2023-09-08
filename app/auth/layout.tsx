// "use client";
import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ColorModeScript } from "@chakra-ui/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
