"use client";
import Image from "next/image";
import Nav from "./components/navbar";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  CloseButton,
  HStack,
  Heading,
  Icon,
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
import { FiHome } from "react-icons/fi";
import {
  queryScheduledMessages,
  removeScheduledMessage,
} from "./utils/constants";
import { ScheduledMessage } from "./interfaces/interfaces";
import { convertAndAdjustDate } from "./utils/formatter";
import { ConfirmationModal } from "./components/modal/confirmationmodal";
import { LuCalendarClock } from "react-icons/lu";

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
    queryScheduledMessages().then((x) => {
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
                  Scheduled Messages
                </Text>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" gap="1" mt="1">
              {scheduledMessages.map((x, index) => (
                <Card
                  borderRadius="xl"
                  key={index}
                  _hover={{
                    background: "#f7f7f7", // Change the background color to a darker shade on hover
                  }}
                >
                  <CardHeader fontWeight="bold" fontSize="sm">
                    Scheduled for {" "}
                    <Text display="inline" color="grey" fontSize="md">
                      {convertAndAdjustDate(x.time)}
                    </Text>
                    <CloseButton
                      size="md"
                      position="absolute"
                      right="0"
                      top="0"
                      m="2"
                      onClick={() => {
                        removeButtonClick(x);
                      }}
                    />
                  </CardHeader>

                  <CardBody pt="0" m="0">
                    <Text fontSize="xl">{x.content}</Text>
                  </CardBody>
                </Card>
              ))}
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
