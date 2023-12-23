"use client";
import Image from "next/image";
import Nav from "./components/navbar";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Heading,
  Icon,
  Stack,
  StackDivider,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useSemester } from "./context/SemesterContext";
import { FiHome } from "react-icons/fi";
import { queryScheduledMessages } from "./utils/constants";
import { ScheduledMessage } from "./interfaces/interfaces";

export default function Home() {
  const session = useSession();

  const [scheduledMessages, setScheduledMessages] = useState<
    ScheduledMessage[]
  >([]);

  useEffect(() => {
    queryScheduledMessages().then((x) => {
      setScheduledMessages(x);
    });
  }, []);

  useEffect(() => {
    console.log(session)
  }, [session])
  

  return (
    <>
      <Nav>
        <main className="max-w-full">
          <Box>
            <Box display="flex" justifyContent="space-between">
              <HStack>
                <Icon fontSize="4xl" as={FiHome} mr={4} />
                <Text fontSize="3xl" fontWeight="bold">
                  Home
                </Text>
              </HStack>
            </Box>
            <Box>Scheduled Messages</Box>
            <Card>
              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Summary
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      View a summary of all your clients over the last month.
                    </Text>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          </Box>
        </main>
      </Nav>
    </>
  );
}
