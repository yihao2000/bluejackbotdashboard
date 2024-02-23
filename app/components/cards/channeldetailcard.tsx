import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CircularProgress,
  CloseButton,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  Channel,
  Class,
  ClassLineGroup,
  ClassLinkDetail,
  RoomClass,
} from "../../interfaces/interfaces";
import { PiClipboardTextLight } from "react-icons/pi";
import { RiGroupLine } from "react-icons/ri";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import LINELogo from "../customlogo";
import ClassDetailModal from "../modal/classdetailmodal";
import { useEffect, useState } from "react";
import {
  CLASS_BOT_QUERY,
  getClassBot,
  queryStudentClass,
  removeChannel,
} from "@/app/utils/constants";
import {
  transformClassSubjectFormat,
  transformStudentClassResponse,
} from "@/app/utils/formatter";
import { MdOutlineDescription } from "react-icons/md";
import { MdOutlineSensorDoor } from "react-icons/md";
import ChannelDetailModal from "../modal/channeldetailmodal";
import { ConfirmationModal } from "../modal/confirmationmodal";
import { GroupedClasses } from "../modal/autoresponsedetailmodal";

interface Data {
  channel: Channel;
  refreshPage: () => void;
  refresh: boolean;
}

export default function ChannelDetailCard(props: Data) {
  const [studentClassList, setStudentClassList] = useState<RoomClass[]>([]);
  const channelDetailModalDisclosure = useDisclosure();

  const confirmationModalDisclosure = useDisclosure();

  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const groupClassesBySubject = (classList: RoomClass[]): GroupedClasses => {
    const grouped: GroupedClasses = {};
    classList.forEach((item) => {
      if (!grouped[item.subject]) {
        grouped[item.subject] = [];
      }
      grouped[item.subject].push(item.class);
    });
    return grouped;
  };

  const groupedClasses = groupClassesBySubject(studentClassList);

  useEffect(() => {
    if (props.channel.channel_subscribers[0] != null) {
      getStudentClass();
    }
  }, [props.channel.channel_subscribers]);

  function setLoading() {
    setIsLoading(true);
  }

  function unsetLoading() {
    setIsLoading(false);
  }

  function openDetailModal() {
    channelDetailModalDisclosure.onOpen();
  }

  function openDeleteModal() {
    confirmationModalDisclosure.onOpen();
  }

  const getStudentClass = async () => {
    setLoading();
    try {
      const results = await Promise.all(
        props.channel.channel_subscribers.map(async (x) => {
          if (x) {
            const res = await queryStudentClass(x);

            res.response.id = x;

            console.log(res);
            return res;
          }
          return null;
        })
      ).finally(() => {
        unsetLoading();
      });
      setStudentClassList(transformStudentClassResponse(results));
    } catch (error) {
      console.error("Error fetching student class:", error);
    }
  };

  const handleDetailButtonClick = () => {
    openDetailModal();
  };

  const handleDeleteButtonClick = () => {
    openDeleteModal();
  };

  const handleDeleteChannel = (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      removeChannel(props.channel.channel_id)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  };

  return (
    <Card className="hover:cursor-pointer hover:scale-105 transition">
      <CardHeader>
        <Heading size="md" maxWidth="sm">
          {props.channel.channel_name}
        </Heading>
        <CloseButton
          size="sm"
          position="absolute"
          top="1rem"
          right="1rem"
          onClick={() => {
            handleDeleteButtonClick();
          }}
        />
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
        <Box className="gap-3" mt={4} maxHeight={200} overflowY={'auto'} borderRadius={10}>
            {isLoading ? (
                <Skeleton width="100" height="80px" />
            ) : Object.keys(groupedClasses).length > 0 ? (
                Object.entries(groupedClasses).map(([subject, classes]) => (
                    <Box
                        p={3}
                        boxShadow="md"
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                        mb={3}
                        bg="white"
                        key={subject}
                    >
                        <Text fontWeight="bold" fontSize="md">{subject}</Text>
                        <Box
                        display="flex"
                        flexWrap="wrap">
                            {classes.map((className: string, index: number) => (
                                <Badge m={1} colorScheme="twitter">
                                    <Text fontSize="sm" key={index}>
                                        {className}
                                    </Text>
                                </Badge>
                            ))}
                        </Box>
                    </Box>
                ))
            ) : (
                <Text color="gray" fontSize="sm">
                    No classes selected
                </Text>
            )}
        </Box>
      </CardBody>
      <CardFooter>
        <Button
          colorScheme={"blue"}
          onClick={() => {
            handleDetailButtonClick();
          }}
        >
          Details
        </Button>
      </CardFooter>

      <ChannelDetailModal
        channel={props.channel}
        {...channelDetailModalDisclosure}
        roomClasses={studentClassList}
        refreshPage={props.refreshPage}
      />

      <ConfirmationModal
        {...confirmationModalDisclosure}
        title="Delete Confirmation"
        description="Are you sure you want to delete selected channel ?"
        action={handleDeleteChannel}
        refreshPage={props.refreshPage}
        successMessage="Channel successfuly removed !"
        errorMessage="Failed to remove channel !"
      />
    </Card>
  );
}
