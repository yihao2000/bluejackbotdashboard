import { ScheduledMessage } from "@/app/interfaces/interfaces";
import { removeScheduledMessage } from "@/app/utils/constants";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

interface ConfirmationProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  title: string;
  content: ScheduledMessage | undefined;
  description: string;
  refreshPage: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationProps> = ({
  isOpen,
  onOpen,
  onClose,
  title,
  content,
  description,
  refreshPage,
}) => {
  const toast = useToast();
  const handleDeleteScheduledMessage = () => {
    if (content?.id) {
      removeScheduledMessage(content?.id)
        .then((x) => {
          toast({
            title: "Success",
            description: "Scheduled message successfuly removed !",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          onClose();
          refreshPage();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleConfirmClick = () => {
    handleDeleteScheduledMessage();
  };

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Box fontSize="l">{description}</Box>
              <Box fontSize="m"></Box>
            </Box>
          </ModalBody>
          <ModalFooter display="flex" gap="2">
            <Button
              colorScheme="red"
              onClick={() => {
                handleConfirmClick();
              }}
            >
              Confirm
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
