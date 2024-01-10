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
  action: () => Promise<void>;
  description: string;
  successMessage: string;
  errorMessage: string;
  refreshPage: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationProps> = ({
  isOpen,
  onOpen,
  onClose,
  title,
  action,
  description,
  successMessage,
  errorMessage,
  refreshPage,
}) => {
  const toast = useToast();
  const handleDeleteScheduledMessage = () => {
    action()
      .then(() => {
        toast({
          title: "Success",
          description: successMessage,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
        refreshPage();
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
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
