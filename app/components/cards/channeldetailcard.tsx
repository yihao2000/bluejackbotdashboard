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
} from "@/app/utils/constants";
import {
  transformClassSubjectFormat,
  transformStudentClassResponse,
} from "@/app/utils/formatter";
import { MdOutlineDescription } from "react-icons/md";
import { MdOutlineSensorDoor } from "react-icons/md";
import ChannelDetailModal from "../modal/channeldetailmodal";

interface Data {
  channel: Channel;
  refreshPage: () => void;
  refresh: boolean;
}

export default function ChannelDetailCard(props: Data) {
  const [studentClassList, setStudentClassList] = useState<RoomClass[]>([]);
  const channelDetailModalDisclosure = useDisclosure();

  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

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
        <Box display="flex" className="items-center gap-2" flexWrap="wrap">
          <MdOutlineMeetingRoom />
          {isLoading ? (
            <Skeleton width="20" height="20px" />
          ) : studentClassList.length > 0 ? (
            studentClassList.map((x) => (
              <Text fontSize="sm" m="0" p="0" key={x.id as React.Key}>
                {x.class}
              </Text>
            ))
          ) : (
            <Text color="gray" fontSize="sm">
              -
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
    </Card>
  );
}
