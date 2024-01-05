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
  useTab,
  IconButton,
} from "@chakra-ui/react";
import { IoMdArrowBack } from "react-icons/io";

import {
  Channel,
  ClassLineGroup,
  ClassTransaction,
  CourseOutline,
  RoomClass,
} from "@/app/interfaces/interfaces";
import { BsQuestionCircle } from "react-icons/bs";
import {
  transformClassApiReponse,
  transformClassSubjectFormat,
  transformClassTransactionApiResponse,
  transformCourseOutlineApiResponse,
} from "@/app/utils/formatter";
import {
  getActiveSemesterCourseOutlines,
  getClassTransactionByCourseOutlineAndSemester,
  removeStudentClass,
} from "@/app/utils/constants";
import { useSession } from "next-auth/react";
import { useSemester } from "@/app/context/SemesterContext";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";

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
  const session = useSession();
  const semester = useSemester();
  const toast = useToast();

  const [groupedClasses, setGroupedClasses] = useState<
    Record<string, RoomClass[]>
  >({});

  const [courseOutlines, setCourseOutlines] = useState<CourseOutline[]>([]);
  const [selectedCourseOutlineName, setselectedCourseOutlineName] =
    useState<string>("");
  const [selectedCourseOutlineId, setSelectedCourseOutlineId] =
    useState<string>("");

  const [roomClassToDelete, setRoomClassToDelete] = useState<RoomClass | null>(
    null
  );
  const [addMoreClass, setAddMoreClass] = useState(false);

  const [loading, setLoading] = useState(false);

  const [classLoading, setClassLoading] = useState(false);

  const [courseClasses, setCourseClasses] = useState<ClassTransaction[]>([]);

  const fetchGroupedClasses = () => {
    const groups: Record<string, RoomClass[]> = {};
    roomClasses.forEach((roomClass) => {
      const key = String(transformClassSubjectFormat(roomClass.subject));
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(roomClass);
    });
    setGroupedClasses(groups);
  };

  const fetchCourseOutlines = () => {
    if (session.data?.user && semester.selectedSemester) {
      const userId = session.data.user.id;
      const semesterID = semester.selectedSemester.semesterID;

      if (userId && semesterID) {
        getActiveSemesterCourseOutlines(userId, semesterID).then((x) => {
          setCourseOutlines(transformCourseOutlineApiResponse(x));
        });
      }
    }
  };

  useEffect(() => {
    if (session && semester) {
      console.log("Kepanggil");
      fetchGroupedClasses();
      fetchCourseOutlines();
    }
  }, [roomClasses, session, semester]);

  const handleDeleteClassClick = (roomClass: RoomClass) => {
    setRoomClassToDelete(roomClass);
  };

  const handleAddMoreClassClick = () => {
    setAddMoreClass(true);
  };

  const handleConfirmDelete = () => {
    const roomId = roomClassToDelete?.id;

    if (roomId) {
      console.log(roomId);
      setLoading(true);
      removeStudentClass(channel.channel_id, roomId)
        .then((x) => {
          toast({
            title: "Success",
            description: "Successfully removed class from channel.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          refreshPage();
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: "An error occurred while removing class.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }

    setRoomClassToDelete(null);
  };

  const handleCancelDelete = () => {
    // Close the confirmation section
    setRoomClassToDelete(null);
  };

  const handleModalClose = () => {
    onClose();
    setRoomClassToDelete(null);
    setAddMoreClass(false);
  };

  const getSelectedCourseOutlineId = (name: string) => {
    const selectedCourseOutline = courseOutlines.find(
      (outline) => outline.name === name
    );

    return selectedCourseOutline ? selectedCourseOutline.id : null;
  };

  const getCourseOutlineClasses = (selectedId: string | null) => {
    if (selectedId != null && semester.selectedSemester?.semesterID != null) {
      //Opsional dipake ato engga
      setSelectedCourseOutlineId(selectedId);

      setClassLoading(true);
      getClassTransactionByCourseOutlineAndSemester(
        semester.selectedSemester?.semesterID,
        selectedId
      )
        .then((x) => {
          // setCourseClasses(transformClassTransactionApiResponse(x));
          transformClassTransactionApiResponse(x);
        })
        .finally(() => {
          setClassLoading(false);
        });
    }
  };

  const handleCourseOutlineChange = (x: string) => {
    setselectedCourseOutlineName(x);

    //Get the id of the selected course outline
    const selectedId = getSelectedCourseOutlineId(x);
    getCourseOutlineClasses(selectedId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex alignItems="center" justify="space-between" width="100%">
            {addMoreClass ? (
              <Flex alignItems="center" gap={2}>
                <IconButton
                  aria-label="Back"
                  icon={<IoMdArrowBack />}
                  onClick={() => setAddMoreClass(false)}
                  size="sm"
                  variant="ghost"
                />
                <span>Add Class</span>
              </Flex>
            ) : (
              <span>Channel Detail</span>
            )}
          </Flex>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {!addMoreClass ? (
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
          ) : (
            <Box>
              {" "}
              <AutoComplete
                onChange={(x: string) => handleCourseOutlineChange(x)}
              >
                <AutoCompleteInput variant="outline" />
                <AutoCompleteList>
                  {courseOutlines.map((x) => (
                    <AutoCompleteItem key={`option-${x.id}`} value={x.name}>
                      {x.name}
                    </AutoCompleteItem>
                  ))}
                </AutoCompleteList>
              </AutoComplete>
            </Box>
          )}
        </ModalBody>

        <ModalFooter>
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
            <Box
              display="flex"
              justifyContent={addMoreClass ? "flex-end" : "space-between"}
              width="full"
            >
              {!addMoreClass && (
                <Button
                  onClick={() => {
                    handleAddMoreClassClick();
                  }}
                >
                  Add More Class
                </Button>
              )}

              <Button
                colorScheme="red"
                onClick={() => {
                  handleModalClose();
                }}
              >
                Close
              </Button>
            </Box>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChannelDetailModal;
