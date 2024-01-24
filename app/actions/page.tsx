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
  Wrap,
  WrapItem,
  useColorMode,
} from "@chakra-ui/react";
import {
  CardData,
  Channel,
  Class,
  ClassLineGroup,
  MessageTemplate,
} from "../interfaces/interfaces";
import ClassCard from "../components/cards/classdetailcard";
import { BsFilter } from "react-icons/bs";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import {
  CLASSES_DETAIL_QUERY,
  LINKED_CLASSES_COURSE_QUERY,
  LINKED_CLASSES_QUERY,
  announceMessage,
  getMessageTemplates,
  queryAssistantClasses,
  queryChannels,
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
  parseContent,
  parseContentAction,
  processContentWithUserInputs,
  transformChannelData,
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
  const [repeatOption, setRepeatOption] = useState("SEND_ONCE");
  const [message, setMessage] = React.useState("");
  const [subjects, setsubjects] = useState<string[]>();
  const [scheduleDate, setscheduleDate] = useState(new Date());
  const { selectedSemester } = useSemester();

  const [displayAnnounceButton, setDisplayAnnounceButton] = useState(false);

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

  const [channels, setChannels] = useState<Channel[]>([]);

  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);

  const [channelLoading, setChannelLoading] = useState(false);

  const [selectedAnnouncementType, setSelectedAnnouncementType] = useState("");

  const [templates, setTemplates] = useState<Array<MessageTemplate>>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate>();

  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const hasNonEmptyValues = (obj: { [key: string]: unknown }): boolean => {
      return Object.values(obj).some((value) => {
        return typeof value === "string" && value.trim() !== "";
      });
    };

    if (selectedTemplate && hasNonEmptyValues(inputValues)) {
      showAnnounceButton();
    } else if (message.length > 4) {
      showAnnounceButton();

      hideAnnounceButton();
    }
  }, [message, inputValues]);

  const showAnnounceButton = () => {
    setDisplayAnnounceButton(true);
  };

  const hideAnnounceButton = () => {
    setDisplayAnnounceButton(false);
  };

  const getClassessubjects = (classes: Class[]) => {
    const subjectSet = new Set<string>();

    for (const cls of classes) {
      subjectSet.add(cls.subject);
    }

    setsubjects(Array.from(subjectSet));
  };

  const loadAssistantClasses = async () => {
    setclassLoading(true);
    try {
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
        description: "An error occurred while fetching class data.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setclassLoading(false);
    }
  };

  const loadChannels = async () => {
    setChannelLoading(true);

    queryChannels()
      .then((res) => {
        setChannels(transformChannelData(res));
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: "An error occurred while fetching channels data.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setChannelLoading(false);
      });
  };
  const fetchData = async () => {
    setChannelLoading(true);

    loadAssistantClasses();
    loadChannels();
    loadTemplates();
  };

  const loadTemplates = async () => {
    try {
      const res = await getMessageTemplates(session.data?.user.id || '');
      const arr: Array<MessageTemplate> = [];
      res.forEach((r: any) => {
        if (r.data_map) {
          const map = new Map(Object.entries(r.data_map));
          arr.push({
            ...r,
            data_map: map,
          });
        } else arr.push(r);
      });
      setTemplates(arr);
    } catch (error) {
      toast({
        title: "Error! Cannot get template data!",
        status: "error",
        isClosable: true,
      });
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
    clearSelectedChannels();
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

  function clearSelectedChannels() {
    setSelectedChannels([]);
  }

  const handleRepeatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRepeatOption(event.target.value);
  };

  const handleAnnouncementTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedTemplate(undefined);
    setMessage("");
    setSelectedAnnouncementType(event.target.value);
  };

  const handleTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOption(event.target.value);
    clearSelectedClasses();
  };

  const handleClassCardClick = (card: Class) => {
    if (selectedClasses.includes(card.id)) {
      setselectedClasses(selectedClasses.filter((id) => id !== card.id));
    } else {
      setselectedClasses([...selectedClasses, card.id]);
    }
  };

  const handleChannelCardClick = (card: Channel) => {
    if (selectedChannels.includes(card.channel_id)) {
      setSelectedChannels(
        selectedChannels.filter((id) => id !== card.channel_id)
      );
    } else {
      setSelectedChannels([...selectedChannels, card.channel_id]);
    }
  };

  const handleTemplateCardClick = (card: MessageTemplate) => {
    setSelectedTemplate(card);
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

  const getRecipients = (): string[] => {
    let recipients: string[] = [];

    if (selectedClasses.length > 0) {
      recipients = selectedClasses;
    }

    if (selectedChannels.length > 0) {
      const channelSubscribers = selectedChannels
        .map((channelId) => {
          const channel = channels.find((c) => c.channel_id === channelId);
          return channel?.channel_subscribers || [];
        })
        .flat();

      recipients = recipients.concat(
        channelSubscribers.filter(
          (subscriber) => !recipients.includes(subscriber)
        )
      );
    }

    return recipients;
  };

  const handleAnnounceMessage = () => {
    setActionLoading(true);

    const recipients = getRecipients();

    if (recipients.length > 0) {
      announceMessage(
        recipients,
        selectedAnnouncementType == "manualmessage"
          ? message
          : (processContentWithUserInputs(
              selectedTemplate?.raw_content || "",
              inputValues
            ) as string)
      )
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
            showAnnouncementModal();
          }
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
    } else {
      toast({
        title: "Error",
        description:
          "Please select classes or channels to send the announcement.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      setActionLoading(false);
    }
  };

  const handleScheduleMessage = () => {
    setActionLoading(true);

    const recipients = getRecipients();

    if (recipients.length > 0 && session.data != null) {
      scheduleMessage(
        recipients,
        selectedAnnouncementType == "manualmessage"
          ? message
          : (processContentWithUserInputs(
              selectedTemplate?.raw_content || "",
              inputValues
            ) as string),
        convertDateFormat(scheduleDate),
        session.data?.user.id,
        repeatOption
      )
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
            showAnnouncementModal();
          }
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
    } else {
      toast({
        title: "Error",
        description:
          "Please select classes or channels to send the announcement.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      setActionLoading(false);
    }
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
    const classesInsubject = classes.filter((cls) => cls.subject === subject);

    const allClassesSelected = classesInsubject.every((cls) =>
      selectedClasses.includes(cls.id)
    );

    if (allClassesSelected) {
      const newSelectedClasses = selectedClasses.filter(
        (classId) => !classesInsubject.map((cls) => cls.id).includes(classId)
      );
      setselectedClasses(newSelectedClasses);
    } else {
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
              onChange={handleTypeSelectChange}
            >
              <option value="announcemessage">Announce message</option>
              <option value="schedulemessage">Schedule a message</option>
            </Select>

            {selectedOption != "" && (
              <>
                <Text>
                  Pick <b>channels</b> that you want to perform selected action
                </Text>
                {!channelLoading ? (
                  <Box
                    display={{ base: "block", md: "flex" }}
                    flexWrap="wrap"
                    gap="2"
                  >
                    {channels.map((x) => {
                      return (
                        <SelectableCard
                          data={x}
                          itemType="channel"
                          key={x.channel_id}
                          onClick={() => handleChannelCardClick(x)}
                          isSelected={selectedChannels.includes(x.channel_id)}
                        />
                      );
                    })}
                  </Box>
                ) : (
                  <Text>sadsa</Text>
                )}
                <Box></Box>{" "}
                <Text>
                  Pick <b>classes</b> that you want to perform selected action
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
                      gap="2"
                    >
                      {classes &&
                        classes.map((x) => (
                          <SelectableCard
                            data={x}
                            itemType="class"
                            key={x.id}
                            onClick={() => handleClassCardClick(x)}
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
              (selectedClasses.length != 0 || selectedChannels.length != 0) && (
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

            {selectedOption == "schedulemessage" &&
              (selectedClasses.length != 0 || selectedChannels.length != 0) && (
                <>
                  <Text>
                    Please select the occurance for the scheduled message
                  </Text>

                  <Select value={repeatOption} onChange={handleRepeatChange}>
                    <option value="SEND_ONCE">Send Once</option>
                    <option value="SEND_EVERY_WEEK">Send Every Week</option>
                    <option value="SEND_EVERY_OTHER_WEEK">
                      Send Every Other Week
                    </option>
                  </Select>
                </>
              )}

            {(selectedClasses.length != 0 || selectedChannels.length != 0) && (
              <>
                <Text>
                  Please select the <b>type of message</b> you want to perform
                </Text>
                <Select
                  placeholder="Select action"
                  value={selectedAnnouncementType}
                  onChange={handleAnnouncementTypeSelectChange}
                >
                  <option value="manualmessage">Manual message</option>
                  <option value="templatemessage">Template message</option>
                </Select>

                {selectedAnnouncementType == "manualmessage" && (
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
                  </>
                )}

                {selectedAnnouncementType == "templatemessage" && (
                  <>
                    <Text>Select template you want to use</Text>
                    <Box
                      display={{ base: "block", md: "flex" }}
                      flexWrap="wrap"
                      gap="2"
                    >
                      {templates.map((x) => {
                        return (
                          <SelectableCard
                            data={x}
                            itemType="messagetemplate"
                            key={x.id}
                            onClick={() => handleTemplateCardClick(x)}
                            isSelected={selectedTemplate == x}
                          />
                        );
                      })}
                    </Box>
                    {selectedTemplate && (
                      <Wrap
                        border="1px"
                        borderRadius="xl"
                        pt="2"
                        pl="3"
                        borderColor="gray.300"
                        minHeight="sm"
                      >
                        {parseContentAction({
                          content: selectedTemplate.raw_content,
                          inputValues: inputValues,
                          setInputValues: setInputValues,
                        }).map((element, index) => (
                          <WrapItem
                            alignItems="center"
                            key={index}
                            display="flex"
                          >
                            {typeof element === "string" ? (
                              <Text fontSize={["sm", "md"]}>{element}</Text>
                            ) : (
                              element
                            )}
                          </WrapItem>
                        ))}
                      </Wrap>
                    )}
                  </>
                )}

                {displayAnnounceButton && (
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
