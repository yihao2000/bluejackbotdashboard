import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { ReactNode } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  header: ReactNode;
  body: ReactNode;
  footer?: ReactNode;
};

const ModalTemplate = (props: Props) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {props.header}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {props.body}
        </ModalBody>
        {props.footer ? (
          <ModalFooter>
            {props.footer}
          </ModalFooter>
        ) : null}
      </ModalContent>
    </Modal>
  );
};

export default ModalTemplate;
