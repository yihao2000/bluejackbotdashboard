import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Flex,
  Input,
  Box,
  Text,
  Divider,
  Tooltip,
  useToast,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import { IoMdArrowBack } from "react-icons/io";
import {
  Channel,
  ClassLineGroup,
  RoomClass,
} from "@/app/interfaces/interfaces";
import { BsQuestionCircle } from "react-icons/bs";
import { transformClassSubjectFormat } from "@/app/utils/formatter";
import { removeStudentClass } from "@/app/utils/constants";

interface ChannelDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: Channel;
  refreshPage: () => void;
  roomClasses: RoomClass[];
}

const ChannelDetailModal: React.FC<ChannelDetailModalProps> = ({
  isOpen,
  onClose,
  channel,
  refreshPage,
  roomClasses,
}) => {
  const [groupedClasses, setGroupedClasses] = useState<
    Record<string, RoomClass[]>
  >({});

  useEffect(() => {
    const groups: Record<string, RoomClass[]> = {};
    roomClasses.forEach((roomClass) => {
      const key = String(transformClassSubjectFormat(roomClass.subject));
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(roomClass);
    });
    setGroupedClasses(groups);
  }, [roomClasses]);

  const [classLineGroup, setClassLineGroup] = useState<ClassLineGroup[]>([]);
  const [roomClassToDelete, setRoomClassToDelete] = useState<RoomClass | null>(
    null
  );
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleDeleteClassClick = (roomClass: RoomClass) => {
    // Set the class to delete
    console.log(roomClass);
    setRoomClassToDelete(roomClass);
  };

  const handleConfirmDelete = () => {
    const roomId = roomClassToDelete?.id;

    if (roomId) {
      console.log(roomId);
      setLoading(true);
      removeStudentClass(channel.channel_id, roomId)
        .then((x) => {
          refreshPage();
        })
        .catch((err) => {})
        .finally(() => {
          setLoading(false);
        });
    }

    // Close the confirmation section
    setRoomClassToDelete(null);
  };

  const handleCancelDelete = () => {
    // Close the confirmation section
    setRoomClassToDelete(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex alignItems="center" gap={2}>
            <span>Channel Detail</span>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Box className="flex gap-2 flex-col">
            <Text>
              Channel Name: <b>{channel.channel_name}</b>
            </Text>

            <Text>
              Channel Description: <b>{channel.channel_description}</b>
            </Text>
            <Divider p="2" />
            {Object.keys(groupedClasses).map((className) => (
              <Box key={className}>
                <Text display="block" py="2">
                  {className}
                </Text>
                <Box display="flex" gap="1" flexWrap="wrap">
                  {groupedClasses[className].map((x) => (
                    <Tag
                      size={"md"}
                      key={String(x.id)}
                      borderRadius="full"
                      variant="solid"
                      colorScheme="twitter"
                    >
                      <TagLabel>{x.class}</TagLabel>
                      <TagCloseButton
                        onClick={() => handleDeleteClassClick(x)}
                      />
                    </Tag>
                  ))}
                </Box>
                <Divider p="2" />
              </Box>
            ))}
          </Box>
        </ModalBody>

        <ModalFooter display="flex" justifyContent="flex-end">
          {/* Confirmation section */}
          {roomClassToDelete && (
            <Box flex="1" textAlign="right">
              <Text mb="2">
                Are you sure you want to remove{" "}
                <b>{roomClassToDelete.class} </b>?
              </Text>
              <Button colorScheme="red" onClick={handleConfirmDelete}>
                Confirm
              </Button>
              <Button ml="2" onClick={handleCancelDelete}>
                Cancel
              </Button>
            </Box>
          )}

          {!roomClassToDelete && (
            <Button
              colorScheme="red"
              onClick={() => {
                onClose();
              }}
            >
              Close
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChannelDetailModal;
