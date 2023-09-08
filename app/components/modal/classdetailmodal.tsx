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
  Input, // Import Flex component
} from "@chakra-ui/react";
import { IoMdArrowBack } from "react-icons/io";
import { ClassDetail } from "@/app/interfaces/interfaces";
import CustomInput from "../custominput";

interface ClassDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  classDetail: ClassDetail;
  refreshPage: () => void;
}

const ClassDetailModal: React.FC<ClassDetailModalProps> = ({
  isOpen,
  onClose,
  classDetail,
  refreshPage,
}) => {
  const [isGroupView, setIsGroupView] = useState(false);

  const [linkFormData, setLinkFormData] = useState({
    cmd: "linkgroup",
    classId: classDetail.class_id,
    linkCode: "",
  });

  const [unlinkFormData, setUnlinkFormData] = useState({
    cmd: "unlinkgroup",
    classId: classDetail.class_id,
  });

  const handleUnlink = () => {
    fetch("https://bluejackbot.jex.ink/server/manualrequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(unlinkFormData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("API request failed");
        }
      })
      .then((data) => {
        // Handle the API response data here
        refreshPage();
      })
      .catch((error) => {
        console.log("Then error");
        // refreshPage();
        // Handle any errors that occurred during the API request
        console.error("API Error:", error);
      });
  };

  useEffect(() => {
    if (linkFormData.linkCode.length == 6) {
      fetch("https://bluejackbot.jex.ink/server/manualrequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(linkFormData),
      })
        .then((response) => {
          refreshPage();
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("API request failed");
          }
        })
        .then((data) => {
          // Handle the API response data here
          refreshPage();
        })
        .catch((error) => {
          //   refreshPage();

          // Handle any errors that occurred during the API request
          console.error("API Error:", error);
        });
    }
  }, [linkFormData]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex alignItems="center" gap={2}>
            {" "}
            {/* Use Flex for alignment */}
            {isGroupView && ( // Conditionally render the arrow button
              <IoMdArrowBack
                onClick={() => {
                  // If in group view, go back to code view
                  setIsGroupView(false);
                }}
                style={{ cursor: "pointer" }} // Add cursor style
              />
            )}
            <span>
              {isGroupView
                ? "Group Code Modal Title"
                : "Class Detail Modal Title"}
            </span>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {classDetail.class_line_group_id == null ? (
            <CustomInput
              onSubmit={(value: string) => {
                console.log(value);
                setLinkFormData((prevData) => ({
                  ...prevData,
                  linkCode: value,
                }));
              }}
            />
          ) : (
            <Button onClick={handleUnlink}>Unlink Group</Button>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              onClose();
              setIsGroupView(false);
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
