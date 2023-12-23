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
} from "@chakra-ui/react";

interface ConfirmationProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  title: string;
  content: string;
}

export const ConfirmationModal: React.FC<ConfirmationProps> = ({
  isOpen,
  onOpen,
  onClose,
  title,
  content,
}) => {
  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              gap="2"
            >
              <Box as="span" display="inline-block" fontSize="xl">
                {title}
              </Box>
              <Box color="success.25" fontWeight="bold" fontSize="2xl">
                {title}
              </Box>
              <Box fontSize="m">{content}</Box>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
