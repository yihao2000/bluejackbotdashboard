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
import { queryScheduledMessages } from "./utils/constants";
import { ScheduledMessage } from "./interfaces/interfaces";
import { convertAndAdjustDate } from "./utils/formatter";
import { ConfirmationModal } from "./components/modal/confirmationmodal";

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

  useEffect(() => {
    queryScheduledMessages().then((x) => {
      setScheduledMessages(x);
    });
  }, [refresh]);

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
            <Box fontSize="xl" fontWeight="bold" py="4">
              Scheduled Messages
            </Box>
            <Box display="flex" flexDirection="column" gap="2">
              {scheduledMessages.map((x, index) => (
                <Card
                  key={index}
                  _hover={{
                    background: "gray.100", // Change the background color to a darker shade on hover
                  }}
                >
                  <CardHeader fontWeight="bold" fontSize="sm">
                    Scheduled for:{" "}
                    <Text display="inline" color="red">
                      {convertAndAdjustDate(x.time)}
                    </Text>
                    <Text display="inline"> | </Text>
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
          content={scheduledMessage}
          refreshPage={refreshPage}
        />
      </Nav>
    </>
  );
}
