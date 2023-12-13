"use client";
import Image from "next/image";
import Nav from "../components/navbar";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Text,
  Textarea,
  useColorMode,
} from "@chakra-ui/react";
import { CardData, Class, ClassLineGroup } from "../interfaces/interfaces";
import ClassCard from "../components/cards/classdetailcard";
import { BsFilter } from "react-icons/bs";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import {
  CLASSES_DETAIL_QUERY,
  LINKED_CLASSES_COURSE_QUERY,
  LINKED_CLASSES_QUERY,
  announceMessage,
  queryAssistantClasses,
  queryClassesCourses,
  queryLinkedAssistantClasses,
  queryLinkedClasses,
  scheduleMessage,
} from "../utils/constants";
import ClassDetailCard from "../components/cards/classdetailcard";
import SelectableCard from "../components/cards/selectablecard";
import { SelectableButton } from "../components/buttons/selectablebutton";
import { useToast } from "@chakra-ui/react";
import { DatePicker } from "@orange_digital/chakra-datepicker";
import { useSemester } from "../context/SemesterContext";
import {
  convertDateFormat,
  formatTime,
  transformClassApiReponse,
  transformClassSubjectFormat,
} from "../utils/formatter";
import { useSession } from "next-auth/react";
import { AnnouncementModal } from "../components/modal/announcementmodal";
import { AiFillCheckCircle } from "react-icons/ai";
import { IconContext } from "react-icons";
import AnimatedButton from "../components/buttons/animatedbutton";

export default function Classes() {
  const [selectedClasses, setselectedClasses] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [message, setMessage] = React.useState("");
  const [subjects, setsubjects] = useState<string[]>();
  const [scheduleDate, setscheduleDate] = useState(new Date());
  const { selectedSemester } = useSemester();

  const [classLoading, setclassLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const toast = useToast();
  const session = useSession();

  const [openAnnouncementModal, setOpenAnnouncementModal] = useState(false);

  const [classes, setClasses] = useState<Array<Class>>([]);
  const [classLineGroups, setClassLineGroups] = useState<
    ClassLineGroup[] | null
  >(null);

  const [refresh, setRefresh] = useState(false);

  const getClassessubjects = (classes: Class[]) => {
    const subjectSet = new Set<string>();

    for (const cls of classes) {
      subjectSet.add(cls.subject);
    }

    setsubjects(Array.from(subjectSet));
  };

  const fetchData = async () => {
    try {
      setclassLoading(true);

      if (session.data?.user.username != null && selectedSemester != null) {
        const classesResponse = await queryAssistantClasses(
          session.data?.user.username,
          selectedSemester.semesterID
        );

        if (classesResponse.response != "") {
          const transformedData = transformClassApiReponse(classesResponse);

          if (transformedData.length > 0) {
            const classIds = transformedData.map((c: Class) => c.id);
            const linkedClassesResponse = await queryLinkedAssistantClasses(
              classIds
            );
            setClassLineGroups(linkedClassesResponse);

            const filteredClasses = transformedData.filter((c: Class) =>
              linkedClassesResponse.some(
                (clg: ClassLineGroup) => clg.class_id === c.id
              )
            );
            getClassessubjects(filteredClasses);
            setClasses(filteredClasses);
          }
        } else {
          setClasses([]);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching data.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setclassLoading(false);
    }
  };

  const clearSelectedClassesData = () => {
    setselectedClasses([]);
  };

  const clearsubjects = () => {
    setsubjects([]);
  };

  const clearMessages = () => {
    setMessage("");
  };

  useEffect(() => {
    fetchData();
    clearSelectedClassesData();
    clearsubjects();
    clearMessages();
  }, [refresh, selectedSemester]);

  function handleTimeChange(newTime: string) {
    const [hours, minutes] = newTime.split(":").map(Number);
    const newDate = new Date(scheduleDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setscheduleDate(newDate);
  }

  function clearSelectedClasses() {
    setselectedClasses([]);
  }
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    clearSelectedClasses();
  };

  const handleCardClick = (card: Class) => {
    if (selectedClasses.includes(card.id)) {
      setselectedClasses(selectedClasses.filter((id) => id !== card.id));
    } else {
      setselectedClasses([...selectedClasses, card.id]);
    }
  };

  const showAnnouncementModal = () => {
    setOpenAnnouncementModal(true);
  };

  const refreshPage = () => {
    setRefresh(!refresh);
  };

  const hideAnnouncementModal = () => {
    setOpenAnnouncementModal(false);
    refreshPage();
  };

  const handleAnnounceMessage = () => {
    //Set Action Loading Animation
    setActionLoading(true);
    announceMessage(selectedClasses, message)
      .then((x) => {
        console.log(x);
        if (x.statusCode === 500) {
          toast({
            title: "API Error",
            description: x.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else if (x.statusCode === 200) {
          //Alert Munculin
          showAnnouncementModal();
        }
        console.log(x);
      })
      .catch((error) => {
        console.error("API Error:", error);
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setActionLoading(false);
      });
  };

  const handleScheduleMessage = () => {
    setActionLoading(true);
    console.log(convertDateFormat(scheduleDate));
    //Set Action Loading Animation
    scheduleMessage(selectedClasses, message, convertDateFormat(scheduleDate))
      .then((x) => {
        if (x.statusCode === 500) {
          toast({
            title: "API Error",
            description: x.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else if (x.statusCode === 200) {
          //Alert Munculin
          showAnnouncementModal();
        }
        console.log(x);
      })
      .catch((error) => {
        console.error("API Error:", error);
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setActionLoading(false);
      });
  };

  const handleAnnounceClick = async () => {
    if (selectedOption == "announcemessage") {
      handleAnnounceMessage();
    } else if (selectedOption == "schedulemessage") {
      handleScheduleMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setMessage(inputValue);
  };

  const handleSelectAllClick = () => {
    const allClassIds = classes.map((c) => c.id);

    if (
      selectedClasses.length === allClassIds.length &&
      selectedClasses.every((classId) => allClassIds.includes(classId))
    ) {
      setselectedClasses([]);
    } else {
      setselectedClasses(allClassIds);
    }
  };

  const handleSelectSpecificClick = (subject: string) => {
    // Filter the classes to include only those with subject === subject
    const classesInsubject = classes.filter((cls) => cls.subject === subject);

    // Check if all the classes in this subject are already selected
    const allClassesSelected = classesInsubject.every((cls) =>
      selectedClasses.includes(cls.id)
    );

    if (allClassesSelected) {
      // If all classes are selected, remove them
      const newSelectedClasses = selectedClasses.filter(
        (classId) => !classesInsubject.map((cls) => cls.id).includes(classId)
      );
      setselectedClasses(newSelectedClasses);
    } else {
      // If not all classes are selected, add them
      const classIdsInsubject = classesInsubject.map((cls) => cls.id);
      setselectedClasses([...selectedClasses, ...classIdsInsubject]);
    }
  };

  return (
    <>
      <Nav>
        <main className="max-w-full pb-2">
          <Box>
            <Text fontSize="2xl" fontWeight="bold">
              Actions
            </Text>
          </Box>
          <Box display="flex" flexDir="column" gap="6">
            <Text mt="6">Choose one of action type you want to perform</Text>
            <Select
              placeholder="Select action"
              value={selectedOption}
              onChange={handleSelectChange}
            >
              <option value="announcemessage">Announce message</option>
              <option value="schedulemessage">Schedule a message</option>
              <option value="recurringmessage">Recurring message</option>
            </Select>

            {selectedOption != "" && (
              <>
                {" "}
                <Text>
                  Pick classes that you want to perform selected action
                </Text>
                {!classLoading ? (
                  <>
                    {subjects && (
                      <Box display="flex" gap="2" flexWrap="wrap">
                        <SelectableButton
                          label="All"
                          selectedClasses={selectedClasses}
                          classesList={classes}
                          handleButtonClick={handleSelectAllClick}
                          colorScheme={
                            selectedClasses.length === classes.length &&
                            classes.every((cls) =>
                              selectedClasses.includes(cls.id)
                            )
                              ? "twitter"
                              : "gray"
                          }
                        />
                        {subjects &&
                          subjects.map((subject) => (
                            <SelectableButton
                              key={subject}
                              label={transformClassSubjectFormat(subject)}
                              selectedClasses={selectedClasses}
                              classesList={classes}
                              handleButtonClick={() =>
                                handleSelectSpecificClick(subject)
                              }
                              colorScheme={
                                classes
                                  .filter((cls) => cls.subject === subject)
                                  .every((cls) =>
                                    selectedClasses.includes(cls.id)
                                  )
                                  ? "twitter"
                                  : "gray"
                              } // Pass the color scheme based on your condition
                            />
                          ))}
                      </Box>
                    )}

                    <Box
                      display={{ base: "block", md: "flex" }}
                      flexWrap="wrap"
                      gap="5"
                    >
                      {classes &&
                        classes.map((x) => (
                          <SelectableCard
                            key={x.id}
                            currentClass={x}
                            onClick={() => handleCardClick(x)}
                            isSelected={selectedClasses.includes(x.id)}
                          />
                        ))}
                    </Box>
                  </>
                ) : (
                  "Loading"
                )}
              </>
            )}

            {selectedOption == "schedulemessage" &&
              selectedClasses.length != 0 && (
                <>
                  <Text>Please select the scheduled message date</Text>
                  <Box width="sm" display="flex" gap="2">
                    <DatePicker
                      initialValue={scheduleDate}
                      onDateChange={(x) => {
                        if (x !== null) {
                          setscheduleDate(x);
                        }
                      }}
                    ></DatePicker>
                    <Input
                      type="time"
                      size="lg"
                      value={formatTime(scheduleDate)}
                      onChange={(e) => {
                        handleTimeChange(e.target.value);
                      }}
                    />
                  </Box>
                </>
              )}

            {selectedClasses.length != 0 && (
              <>
                <Text>Please enter the announcement</Text>
                <Textarea
                  value={message}
                  onChange={handleInputChange}
                  placeholder="Announcement length must be more than 5"
                  size="md"
                  resize="vertical"
                  height="xs"
                />

                {message.length > 4 && (
                  <>
                    <AnimatedButton
                      isLoading={actionLoading}
                      onClick={handleAnnounceClick}
                    />
                  </>
                )}
                {}
              </>
            )}
          </Box>
          {openAnnouncementModal && (
            <>
              <AnnouncementModal
                title="SUCCESS !"
                description="Message have been successfully sent."
                isOpen={openAnnouncementModal}
                onOpen={() => showAnnouncementModal()}
                onClose={() => hideAnnouncementModal()}
                icon={
                  <IconContext.Provider
                    value={{ color: "#40bc7c", size: "100" }}
                  >
                    <AiFillCheckCircle />
                  </IconContext.Provider>
                }
              />
            </>
          )}
        </main>
      </Nav>
    </>
  );
}
