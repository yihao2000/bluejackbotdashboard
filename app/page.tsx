"use client";
import Image from "next/image";
import Nav from "./components/navbar";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  CloseButton,
  HStack,
  Heading,
  Icon,
  Skeleton,
  Stack,
  StackDivider,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useSemester } from "./context/SemesterContext";
import { FiHome, FiMessageCircle } from "react-icons/fi";
import {
  queryScheduledMessages,
  queryStudentClass,
  removeScheduledMessage,
} from "./utils/constants";
import { RoomClass, ScheduledMessage } from "./interfaces/interfaces";
import { convertAndAdjustDate, parseContent, transformStudentClassResponse } from "./utils/formatter";
import { ConfirmationModal } from "./components/modal/confirmationmodal";
import { LuCalendarClock } from "react-icons/lu";
import { GroupedClasses } from "./components/modal/autoresponsedetailmodal";
import ScheduledMessageCard from "./components/cards/scheduledmessagecard";

export default function Home() {
  const session = useSession();
  const confirmationModalDisclosure = useDisclosure();

  const [scheduledMessages, setScheduledMessages] = useState<
    ScheduledMessage[]
  >([]);

  const [refresh, setRefresh] = useState(false);

  const [scheduledMessage, setScheduledMessage] = useState<ScheduledMessage>();

  const refreshPage = () => {
    setRefresh(!refresh);
  };

  const openConfirmationmodal = () => {
    confirmationModalDisclosure.onOpen();
  };

  const removeButtonClick = (data: ScheduledMessage) => {
    openConfirmationmodal();
    setScheduledMessage(data);
  };

  const handleDeleteScheduledMessage = (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      if (scheduledMessage) {
        if (scheduledMessage.id) {
          removeScheduledMessage(scheduledMessage.id)
            .then(() => {
              resolve();
            })
            .catch((err) => {
              console.error(err);
              reject(err);
            });
        } else {
          reject(new Error("No content ID available"));
        }
      } else {
        reject(new Error("No scheduled message available"));
      }
    });
  };

  useEffect(() => {
    queryScheduledMessages(session.data?.user.id || '').then((x) => {
      setScheduledMessages(x);
    });
  }, [refresh]);

  useEffect(() => {
    console.log(session);
  }, [session]);

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
            <Box mt="4">
              <Box
                borderRadius="xl"
                width="full"
                bgColor="gray.200"
                p="3"
                display="flex"
                alignItems="center"
              >
                <Icon fontSize="xl" as={LuCalendarClock} mr={3} />
                <Text fontWeight="medium" fontSize="xl">
                  Your Pending Scheduled Messages
                </Text>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" gap="1" mt="5">
              {scheduledMessages.length > 0 ? (
                scheduledMessages.map((x, index) => (
                  <ScheduledMessageCard
                    key={index}
                    scheduledMessage={x}
                    removeButtonClick={removeButtonClick}
                  />
                ))
              ) : (
                <Box textAlign="center" mt="5">
                  <Icon as={FiMessageCircle} w={10} h={10} color="gray.500" />
                  <Text mt={2} fontSize="lg" color="gray.500">
                    No scheduled messages yet.
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
        </main>

        <ConfirmationModal
          {...confirmationModalDisclosure}
          title="Delete Confirmation"
          description="Are you sure you want to delete selected scheduled message ?"
          action={handleDeleteScheduledMessage}
          refreshPage={refreshPage}
          successMessage="Scheduled message successfuly removed !"
          errorMessage="Failed to schedule message !"
        />
      </Nav>
    </>
  );
}
