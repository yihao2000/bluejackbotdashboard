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

interface Data {
  class: Class;
  isLinked: boolean;
  refreshPage: () => void;
}

export default function ClassDetailCard(props: Data) {
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
    setClassBotResult(null);
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
    getSpecifiedClassBot(classID);
    openDetailModal();
  };

  return (
    <Card className="hover:cursor-pointer hover:scale-105 transition">
      <CardHeader>
        <Heading size="md">
          {transformClassSubjectFormat(props.class.subject)}
        </Heading>
      </CardHeader>
      <CardBody py={0}>
        <Box display="flex" className="items-center gap-2">
          <PiClipboardTextLight />
          <Text fontSize="sm">{props.class.class}</Text>
        </Box>
        <Box display="flex" className="items-center gap-2">
          <RiGroupLine />
          <Text fontSize="sm">{props.class.assistant}</Text>
        </Box>
        <Box display="flex" className="items-center gap-2">
          <MdOutlineMeetingRoom />
          <Text fontSize="sm">{props.class.room}</Text>
        </Box>

        <Box display="flex" className="items-center gap-2">
          <Image src="/linelogo.svg" />
          <Text
            fontWeight="bold"
            fontSize="sm"
            color={props.isLinked ? "green" : "gray.500"}
          >
            {props.isLinked ? "Linked" : "Not Linked"}
          </Text>
        </Box>
      </CardBody>
      <CardFooter>
        <Button
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
        </Button>

        {/* {props.isLinked ? (
          <Button
            onClick={classDetailModalDisclosure.onOpen}
            colorScheme={
              props.classDetail.class_line_group_id == null ? "green" : "blue"
            }
          >
            Hai
            {props.classDetail.class_line_group_id == null ? "Link" : "Details"}
          </Button>
          ) : ( }
          {/* <Button onClick={groupCodeModalDisclosure.onOpen}>Link</Button> */}
        {/* )} */}
      </CardFooter>

      {classBotResult && (
        <ClassDetailModal
          selectedClass={props.class}
          {...classDetailModalDisclosure}
          classLinkDetail={classBotResult}
          refreshPage={props.refreshPage}
        />
      )}
    </Card>
  );
}
