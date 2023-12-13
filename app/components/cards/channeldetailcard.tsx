import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CircularProgress,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  Channel,
  Class,
  ClassLineGroup,
  ClassLinkDetail,
} from "../../interfaces/interfaces";
import { PiClipboardTextLight } from "react-icons/pi";
import { RiGroupLine } from "react-icons/ri";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import LINELogo from "../customlogo";
import ClassDetailModal from "../modal/classdetailmodal";
import { useEffect, useState } from "react";
import { CLASS_BOT_QUERY, getClassBot } from "@/app/utils/constants";
import { transformClassSubjectFormat } from "@/app/utils/formatter";
import { MdOutlineDescription } from "react-icons/md";
import { MdOutlineSensorDoor } from "react-icons/md";

interface Data {
  channel: Channel;
  refreshPage: () => void;
}

export default function ChannelDetailCard(props: Data) {
  const classDetailModalDisclosure = useDisclosure();
  const [classBotResult, setClassBotResult] = useState<ClassLinkDetail | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  function setLoading() {
    setIsLoading(true);
  }

  function unsetLoading() {
    setIsLoading(false);
  }

  function openDetailModal() {
    classDetailModalDisclosure.onOpen();
  }

  const getSpecifiedClassBot = (classID: string) => {
    getClassBot(classID)
      .then((res) => {
        console.log(res);
        setClassBotResult(res);
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to fetch bot for the selected class",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        unsetLoading();
      });
  };

  const handleClassButtonClick = (classID: string) => {
    openDetailModal();
    getSpecifiedClassBot(classID);
  };

  return (
    <Card className="hover:cursor-pointer hover:scale-105 transition">
      <CardHeader>
        <Heading size="md">{props.channel.channel_name}</Heading>
      </CardHeader>
      <CardBody py={0}>
        <Box display="flex" className="items-start gap-2">
          <Box className="mt-1">
            <MdOutlineDescription />
          </Box>
          <Text
            fontSize="sm"
            flexWrap="wrap"
            overflow="hidden"
            whiteSpace="break-spaces"
            textOverflow="ellipsis"
          >
            {props.channel.channel_description}
          </Text>
        </Box>
        <Box display="flex" className="items-center gap-2">
          <MdOutlineMeetingRoom />
          {
            
          }
        </Box>
      </CardBody>
      <CardFooter>
        {/* <Button
          onClick={() => {
            handleClassButtonClick(props.class.id);
          }}
          colorScheme={props.isLinked ? "blue" : "green"}
        >
          {isLoading ? (
            <CircularProgress isIndeterminate color="blue.200" size="1.3em" />
          ) : props.isLinked ? (
            "Details"
          ) : (
            "Link"
          )}
        </Button> */}
      </CardFooter>

      {/* {classBotResult && (
        <ClassDetailModal
          selectedClass={props.class}
          {...classDetailModalDisclosure}
          classLinkDetail={classBotResult}
          refreshPage={props.refreshPage}
        />
      )} */}
    </Card>
  );
}
