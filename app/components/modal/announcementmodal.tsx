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

interface AnnouncementProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  icon: React.ReactNode; // Add this line for the icon prop
  title: string;
  description: string;
}

export const AnnouncementModal: React.FC<AnnouncementProps> = ({
  isOpen,
  onOpen,
  onClose,
  icon,
  title,
  description,
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
                {icon}
              </Box>
              <Box color="success.25" fontWeight="bold" fontSize="2xl">
                {title}
              </Box>
              <Box fontSize="m">{description}</Box>
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
