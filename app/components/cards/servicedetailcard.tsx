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
  Divider,
  HStack,
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
  Stack,
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
  Service,
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
import { ConfirmationModal } from "../modal/confirmationmodal";

interface ItemDetailCardProps {
  item: any;
  itemType: 'service' | 'state' | 'response' | 'condition' | 'apiCall';
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  refreshPage: () => void;
}

export const ServiceItemDetailCard: React.FC<ItemDetailCardProps> = ({ item, itemType, onEdit, onDelete, refreshPage }) => {

  const renderHeading = () => {
    let heading = '';
    let itemId = '';
    let httpMethod = '';

    switch (itemType) {
      case 'service':
        heading = item.service_name;
        itemId = item.service_id;
        break;
      case 'state':
        heading = item.service_state_name;
        itemId = item.service_state_id;
        break;
      case 'response':
        heading = item.service_response_name;
        itemId = item.service_response_id;
        break;
      case 'condition':
        heading = item.service_condition_name;
        itemId = item.service_condition_id;
        break;
      case 'apiCall':
        heading = item.api_endpoint;
        itemId = item.service_api_call_id;
        httpMethod = item.http_method;
        break;
      default:
        break;
    }

    return (
      <Box display="vertical" alignItems="center">
        <HStack>
          <Heading size="md" mr={3}>{heading}</Heading>
          <CloseButton
            size="sm"
            position="absolute"
            top="1rem"
            right="1rem"
            onClick={() => {
              onDelete(item);
            }}
          />
        </HStack>
        {
          itemType == 'apiCall' && httpMethod == 'POST' ? <Badge colorScheme="orange" px={2} borderRadius="md">POST</Badge> :
          itemType == 'apiCall' ? <Badge colorScheme="yellow" px={2} borderRadius="md">GET</Badge> : ''
        }
        <Badge colorScheme="blue" px={2} borderRadius="md">{itemId}</Badge>
      </Box>
    );
  };

  const renderDetails = () => {
    const details = [];
    for (const key in item) {
      if (key !== 'service_id' && key !== 'service_state_id' && key !== 'service_response_id' && key !== 'service_condition_id' && key !== 'service_api_call_id') {
        details.push(
          <Box display="flex" alignItems="center" gap={2}>
            <MdOutlineDescription />
            <Text fontSize="sm">{`${key}: ${item[key]}`}</Text>
          </Box>
        );
      }
    }
    return details;
  };

  

  return (
    <Card className="hover:cursor-pointer hover:scale-105 transition">
      <CardHeader>
        {renderHeading()}
      </CardHeader>
      <CardBody py={0}>
        {renderDetails()}
      </CardBody>
      <CardFooter>
        <Stack spacing={4} direction={'row'}>
          <Button colorScheme="blue" onClick={() => onEdit(item)}>Edit</Button>
        </Stack>
      </CardFooter>
    </Card>
  );
};
