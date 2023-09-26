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
import { CardData, Class, ClassDetail, Course } from "../interfaces/interfaces";
import ClassCard from "../components/cards/classdetailcard";
import { BsFilter } from "react-icons/bs";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import {
  CLASSES_DETAIL_QUERY,
  LINKED_CLASSES_COURSE_QUERY,
  LINKED_CLASSES_QUERY,
  announceMessage,
  queryClassesCourses,
  queryLinkedClasses,
} from "../utils/constants";
import ClassDetailCard from "../components/cards/classdetailcard";
import SelectableCard from "../components/cards/selectablecard";
import { SelectableButton } from "../components/buttons/selectablebutton";
import { useToast } from "@chakra-ui/react";
import { DatePicker } from "@orange_digital/chakra-datepicker";

export default function Classes() {
  const [selectedClasses, setselectedClasses] = useState<string[]>([]);
  const [classesList, setClassesList] = useState<Class[]>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [message, setMessage] = React.useState("");
  const [coursesList, setCoursesList] = useState<Course[]>();
  const [startDate, setStartDate] = useState(new Date());

  const toast = useToast();

  function formatTime(date: Date) {
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  }

  function handleTimeChange(newTime: string) {
    const [hours, minutes] = newTime.split(":").map(Number);
    const newDate = new Date(startDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setStartDate(newDate);
  }

  function clearSelectedClasses() {
    setselectedClasses([]);
  }
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    clearSelectedClasses();
  };

  const handleCardClick = (card: Class) => {
    if (selectedClasses.includes(card.classid)) {
      setselectedClasses(selectedClasses.filter((id) => id !== card.classid));
    } else {
      setselectedClasses([...selectedClasses, card.classid]);
    }
  };

  const handleAnnounceClick = async () => {
    if (selectedOption == "announcemessage") {
      try {
        await announceMessage(selectedClasses, message);
      } catch (error) {
        console.error("API Error:", error);
        toast({
          title: "Error",
          description: "An error occurred while processing your request.",
          status: "error",
          duration: 5000, // Duration in milliseconds
          isClosable: true, // Allow the user to close the toast
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setMessage(inputValue);
  };

  const handleSelectAllClick = () => {
    const allClassIds = classesList.map((c) => c.classid);

    if (
      selectedClasses.length === allClassIds.length &&
      selectedClasses.every((classId) => allClassIds.includes(classId))
    ) {
      setselectedClasses([]);
    } else {
      setselectedClasses(allClassIds);
    }
  };

  const handleSelectSpecificClick = (courseid: string) => {
    const allClassIdsInCourseSelected = classesList
      .filter((cls) => cls.courseid === courseid)
      .every((cls) => selectedClasses.includes(cls.classid));

    if (allClassIdsInCourseSelected) {
      const newSelectedClasses = selectedClasses.filter(
        (classId) =>
          !classesList
            .filter((cls) => cls.courseid === courseid)
            .map((cls) => cls.classid)
            .includes(classId)
      );
      setselectedClasses(newSelectedClasses);
    } else {
      const classIdsInCourse = classesList
        .filter((cls) => cls.courseid === courseid)
        .map((cls) => cls.classid);
      setselectedClasses([...selectedClasses, ...classIdsInCourse]);
    }
  };

  function queryAllData() {
    queryLinkedClasses()
      .then((result) => {
        console.log(result);
        setClassesList(result); // Update the state with the fetched data
      })
      .catch((error) => {
        console.error("Error fetching linked classes:", error);
        toast({
          title: "Error",
          description: "An error occurred while fetching linked classes.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });

    queryClassesCourses()
      .then((result) => {
        setCoursesList(result);
      })
      .catch((error) => {
        console.error("Error fetching classes courses:", error);
        toast({
          title: "Error",
          description: "An error occurred while fetching classes courses.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  }

  useEffect(() => {
    queryAllData();
  }, []);

  return (
    <>
      <Nav>
        <main className="max-w-full">
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
                {classesList && (
                  <Box display="flex" gap="2" flexWrap="wrap">
                    <SelectableButton
                      label="All"
                      selectedClasses={selectedClasses}
                      classesList={classesList}
                      handleButtonClick={handleSelectAllClick}
                      colorScheme={
                        selectedClasses.length === classesList.length &&
                        classesList.every((cls) =>
                          selectedClasses.includes(cls.classid)
                        )
                          ? "twitter"
                          : "gray"
                      } // Pass the color scheme based on your condition
                    />
                    {coursesList &&
                      coursesList.map((course) => (
                        <SelectableButton
                          key={course.id}
                          label={`${course.code} - ${course.name}`}
                          selectedClasses={selectedClasses}
                          classesList={classesList}
                          handleButtonClick={() =>
                            handleSelectSpecificClick(course.id)
                          }
                          colorScheme={
                            classesList
                              .filter((cls) => cls.courseid === course.id)
                              .every((cls) =>
                                selectedClasses.includes(cls.classid)
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
                  {classesList &&
                    classesList.map((x) => (
                      <SelectableCard
                        key={x.classid}
                        title={x.classname}
                        content={"GO22-2"}
                        onClick={() => handleCardClick(x)}
                        isSelected={selectedClasses.includes(x.classid)}
                      />
                    ))}
                </Box>
              </>
            )}

            {selectedOption == "schedulemessage" && (
              <>
                <Text>Please select the scheduled message date</Text>
                <Box width="sm" display="flex" gap="2">
                  <DatePicker
                    initialValue={startDate}
                    onDateChange={(x) => {
                      if (x !== null) {
                        setStartDate(x);
                      }
                    }}
                  ></DatePicker>
                  <Input
                    type="time"
                    size="lg"
                    value={formatTime(startDate)}
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
                    <Button onClick={handleAnnounceClick}>Announce</Button>
                  </>
                )}
                {}
              </>
            )}
          </Box>
        </main>
      </Nav>
    </>
  );
}
