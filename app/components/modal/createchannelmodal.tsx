import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { createChannel } from "@/app/utils/constants";

interface AnnouncementProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  refreshPage: () => void;
}

export const CreateChannelModal: React.FC<AnnouncementProps> = ({
  isOpen,
  onOpen,
  onClose,
  refreshPage,
}) => {
  const [channelData, setChannelData] = useState({
    channelName: "",
    channelDescription: "",
  });

  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const showError = (message: string) => {
    const toastId = message.toLowerCase().replace(/\s/g, "");
    if (!toast.isActive(toastId)) {
      toast({
        title: message,
        status: "error",
        isClosable: true,
        id: toastId,
      });
    }
  };

  const clearFields = () => {
    setChannelData({
      channelName: "",
      channelDescription: "",
    });
  };

  const handleCreateChannel = () => {
    createChannel(channelData.channelName, channelData.channelDescription)
      .then((x) => {
        setLoading(true);
        toast({
          title: x.message,
          status: "success",
          isClosable: true,
        });
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Error! Unable to create channel right now",
          status: "error",
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
        onClose();
        clearFields();
        refreshPage();
      });
  };

  const validateFields = () => {
    if (channelData.channelName === "") {
      showError("Channel Name cannot be empty!");
    } else if (channelData.channelDescription === "") {
      showError("Channel Description cannot be empty!");
    } else {
      toast.closeAll();
      handleCreateChannel();
    }
  };

  const handleCreateChannelClick = () => {
    validateFields();
  };

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Channel</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box gap="2" display="Flex" flexDirection="column">
              <Box>Channel Name</Box>
              <Input
                value={channelData.channelName}
                onChange={(e) =>
                  setChannelData((prevData) => ({
                    ...prevData,
                    channelName: e.target.value,
                  }))
                }
              />

              <Box>Channel Description</Box>
              <Textarea
                value={channelData.channelDescription}
                onChange={(e) =>
                  setChannelData((prevData) => ({
                    ...prevData,
                    channelDescription: e.target.value,
                  }))
                }
              />
              <Box as="span" display="inline-block" fontSize="xl"></Box>
              <Box color="success.25" fontWeight="bold" fontSize="2xl"></Box>
              <Box fontSize="m"></Box>
            </Box>
          </ModalBody>
          <ModalFooter gap="2">
            <Button
              onClick={handleCreateChannelClick}
              colorScheme="twitter"
              isLoading={loading}
              loadingText="Creating..."
            >
              Create
            </Button>
            <Button onClick={onClose} colorScheme="red">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
