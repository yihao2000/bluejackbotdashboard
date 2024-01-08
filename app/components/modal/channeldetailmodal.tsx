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
  Box,
  Text,
  Divider,
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
  Item,
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
  addChannelSubscribers,
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

import { CUIAutoComplete } from "chakra-ui-autocomplete";

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

  useEffect(() => {
    if (session && semester) {
      fetchGroupedClasses();
      fetchCourseOutlines();
    }
  }, [roomClasses, session, semester]);

  const [selectedClassess, setSelectedClasses] = React.useState<Item[]>([]);

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

  const [courseClasses, setCourseClasses] = useState<Item[] | null>(null);

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

  const handleSelectedClassesChange = (selectedClass?: Item[]) => {
    if (selectedClass) {
      setSelectedClasses(selectedClass);
    }
  };

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

  const filterClassesById = (
    res: any,
    groupedClasses: Record<string, RoomClass[]>
  ) => {
    const transformedResponse = transformClassTransactionApiResponse(res);

    return transformedResponse.filter((x: any) => {
      const classId = x.value;
      return !Object.values(groupedClasses).some((classes) =>
        classes.some((roomClass) => String(roomClass.id) === String(classId))
      );
    });
  };

  const getCourseOutlineClasses = (selectedId: string | null) => {
    if (selectedId != null && semester.selectedSemester?.semesterID != null) {
      // Optional, you can still use this line if needed
      setSelectedCourseOutlineId(selectedId);

      setClassLoading(true);
      getClassTransactionByCourseOutlineAndSemester(
        semester.selectedSemester?.semesterID,
        selectedId
      )
        .then((x) => {
          const filteredClasses = filterClassesById(x, groupedClasses);
          console.log(filteredClasses);
          setCourseClasses(filteredClasses);
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

  const clearData = () => {
    setselectedCourseOutlineName("");
    setSelectedCourseOutlineId("");
    setCourseClasses(null);
    setSelectedClasses([]);
  };

  const handleBackButtonClicked = () => {
    setAddMoreClass(false);
    clearData();
  };

  const handleAddSelectedClassesClick = () => {
    console.log("Keclick");

    // Extracting only the 'value' property from each item in selectedClassess
    const extractedClassesID = selectedClassess.map((item) => item.value);

    // Ensure that extractedClassesID is an array and not empty
    if (!Array.isArray(extractedClassesID) || extractedClassesID.length === 0) {
      // Handle the case where no classes are selected
      console.error("No classes selected.");
      return;
    }

    addChannelSubscribers(channel.channel_id, extractedClassesID)
      .then((response) => {
        console.log(response);
        refreshPage();
        handleModalClose();
      })
      .catch((error) => {
        console.error("Error adding channel subscribers:", error);
        // Handle the error appropriately
        // You may want to show a toast or update the UI to inform the user
      })
      .finally(() => {
        clearData();
      });
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
                  onClick={() => handleBackButtonClicked()}
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
          {addMoreClass && courseClasses != null && (
            <CUIAutoComplete
              placeholder="Search classes"
              items={courseClasses}
              selectedItems={selectedClassess}
              onSelectedItemsChange={(changes: any) =>
                handleSelectedClassesChange(changes.selectedItems)
              }
            />
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
            <Box display="flex" justifyContent="space-between" width="full">
              {!addMoreClass && !roomClassToDelete && (
                <Button
                  onClick={() => {
                    handleAddMoreClassClick();
                  }}
                >
                  Add More Class
                </Button>
              )}

              <Button
                visibility={selectedClassess.length > 0 ? "visible" : "hidden"}
                onClick={() => {
                  handleAddSelectedClassesClick();
                }}
              >
                Add Selected Classes
              </Button>

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
