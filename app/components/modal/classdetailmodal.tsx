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
} from "@chakra-ui/react";
import { IoMdArrowBack } from "react-icons/io";
import {
  Class,
  ClassLineGroup,
  ClassLinkDetail,
} from "@/app/interfaces/interfaces";
import CustomInput from "../custominput";
import { AiOutlineCheck } from "react-icons/ai";
import { useQRCode } from "next-qrcode";
import { checkClassLinked, linkClass } from "@/app/utils/constants";
import {
  transformClassSubjectFormat,
  transformStringToDate,
} from "@/app/utils/formatter";

import { BsQuestionCircle } from "react-icons/bs";

interface ClassDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  classLinkDetail: ClassLinkDetail;
  refreshPage: () => void;
  selectedClass: Class;
}

const ClassDetailModal: React.FC<ClassDetailModalProps> = ({
  isOpen,
  onClose,
  classLinkDetail,
  refreshPage,
  selectedClass,
}) => {
  const { Canvas } = useQRCode();

  const [classLineGroup, setClassLineGroup] = useState<ClassLineGroup[]>([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const checkSpecificClassLinked = async () => {
    checkClassLinked(selectedClass.id).then((x: Array<ClassLineGroup>) => {
      setClassLineGroup(x);
    });
  };

  useEffect(() => {
    checkSpecificClassLinked();
  }, [isOpen]);

  const [linkFormData, setLinkFormData] = useState({
    params: {
      classID: selectedClass.id,
      linkCode: "",
    },
  });

  const showResult = (res: any) => {
    if (res.message != "Linking successful") {
      toast({
        title: "Error",
        description: res.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      onClose();
      refreshPage();
    }
  };

  const handleLink = () => {
    if (linkFormData.params.linkCode.length == 4) {
      setLoading(true);
      const { classID, linkCode } = linkFormData.params;
      linkClass(classID, linkCode)
        .then((res) => {
          showResult(res);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const LinkModalBody: React.FC = () => {
    return (
      <>
        <Box fontWeight="bold">
          Bot {classLinkDetail.bot_name} has been assigned for you
        </Box>
        <Box className="flex gap-2 flex-col">
          <Text>Add the bot by scanning the QR Code below !</Text>
          <Box className="flex justify-center">
            <Canvas
              text={classLinkDetail.bot_invite_link}
              options={{
                errorCorrectionLevel: "M",
                margin: 3,
                scale: 4,
                width: 200,
                color: {
                  // dark: "#010599FF",
                  // light: "#FFBF60FF",
                },
              }}
            />
          </Box>
        </Box>
        <Box>
          Invite the bot to your group and enter the given verification code
        </Box>
        <Box display="flex" justifyContent="center" mt="4">
          {!loading ? (
            <CustomInput
              onSubmit={(value: string) => {
                setLinkFormData((prevData) => ({
                  params: {
                    ...prevData.params, // Preserve other params
                    linkCode: value,
                  },
                }));
              }}
            />
          ) : (
            "Loading"
          )}
        </Box>
      </>
    );
  };

  const DetailModalBody: React.FC = () => {
    return (
      <>
        <Box fontWeight="bold"></Box>
        <Box className="flex gap-2 flex-col">
          <Text>
            Course: <b>{transformClassSubjectFormat(selectedClass.subject)}</b>
          </Text>

          <Text>
            Class: <b>{selectedClass.class}</b>
          </Text>
          <Text>
            Assistants: <b>{selectedClass.assistant}</b>
          </Text>
          <Text>
            Room: <b>{selectedClass.room}</b>
          </Text>
          <Text>
            Total Students: <b>{selectedClass.totalStudent}</b>
          </Text>
          <Text>
            Class Realization: <b>{selectedClass.realization}</b>
          </Text>
          <Divider p="2" />
          <Box className="flex gap-2 flex-col">
            <Text>
              Assigned Bot: <b>{classLinkDetail.bot_name}</b>
            </Text>
            <Text>
              Linked at:{" "}
              <b>{transformStringToDate(classLineGroup[0].last_linked_at)}</b>
            </Text>
            {/* <Text>Linked at: {classLinkDetail}</Text> */}
          </Box>
        </Box>
      </>
    );
  };

  useEffect(() => {
    handleLink();
  }, [linkFormData]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex alignItems="center" gap={2}>
            <span>
              {classLineGroup?.length != 0 ? "Class Detail" : "Bot Linking"}
            </span>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {classLineGroup?.length != 0 ? (
            <DetailModalBody />
          ) : (
            <LinkModalBody />
          )}
        </ModalBody>

        <ModalFooter display="flex" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap="2">
            {classLineGroup.length != 0 && (
              <>
                <Text fontSize="sm">How to unlink</Text>
                <Tooltip
                  label="To unlink, simply remove the bot from the line group !"
                  fontSize="md"
                  shouldWrapChildren
                >
                  <BsQuestionCircle />
                </Tooltip>
              </>
            )}
          </Box>
          <Button
            colorScheme="red"
            mr={3}
            onClick={() => {
              onClose();
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ClassDetailModal;
