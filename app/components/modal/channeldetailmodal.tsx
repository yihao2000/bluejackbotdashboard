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

// ... (imports)

const ChannelDetailModal: React.FC<ChannelDetailModalProps> = ({
  isOpen,
  onClose,
  channel,
  refreshPage,
  roomClasses,
}) => {
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
    // Perform the delete action for the classToDelete
    // ...

    const roomId = roomClassToDelete?.id; // Get the id if it's defined

    if (roomId) {
      setLoading(true);
      removeStudentClass(channel.channel_id, roomId)
        .then((x) => {})
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

            <Text display="block">Channel Classes:</Text>

            <Box display="flex" gap="1" flexWrap="wrap">
              {roomClasses.map((x) => (
                <Tag
                  size={"md"}
                  key={String(x.class)}
                  borderRadius="full"
                  variant="solid"
                  colorScheme="twitter"
                >
                  <TagLabel>
                    {x.class} - {transformClassSubjectFormat(x.subject)}
                  </TagLabel>
                  <TagCloseButton onClick={() => handleDeleteClassClick(x)} />
                </Tag>
              ))}
            </Box>

            <Divider p="2" />
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
