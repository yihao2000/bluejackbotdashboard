"use client";
import { Channel, Class, ClassLineGroup, MessageTemplate } from "@/app/interfaces/interfaces";
import {
  Box,
  Flex,
  Textarea,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  Select,
  useToast,
  Checkbox,
  Switch,
  HStack,
  Divider,
  Text,
} from "@chakra-ui/react";
import React, { SyntheticEvent, useEffect, useState } from "react";
import ModalTemplate from "./ModalTemplate";
import { AiOutlinePlus } from "react-icons/ai";
import { createAutoResponse, createMessageTemplate, queryAssistantClasses, queryChannels, queryLinkedAssistantClasses, updateAutoResponse, updateMessageTemplate } from "@/app/utils/constants";
import { useSession } from "next-auth/react";
import { useSemester } from "@/app/context/SemesterContext";
import { transformChannelData, transformClassApiReponse } from "@/app/utils/formatter";
import EnhancedMultiSelect from "../enhancedmultiselect";

type Props = {
  templateData: FormData;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: MessageTemplate) => void;
  onFail: () => void;
  refreshPage: () => void;
};

type ParamType = {
  name: string;
  type: string;
};

type FormData = {
    id: string;
    name: string;
    trigger_type: string;
    trigger_words: string;
    trigger_recipients: string;
    response_message: string;
    is_enabled: boolean;
};

const defaultData = {
  id: "",
  name: "",
  category: "",
  raw_content: "",
  is_shared: 0,
  // data_map: new Map<string, string>(),
};

const fixedParams = ["Class Name", "Course Code", "Course Name"];

const EditAutoResponse = (props: Props) => {
    const [formData, setFormData] = useState<FormData>(props.templateData);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
  
    const [classes, setClasses] = useState<Class[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);
  
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
    const [warningMessage, setWarningMessage] = useState("");
  
    const [subjects, setSubjects] = useState<string[]>();
  
    const [classLineGroups, setClassLineGroups] = useState<
      ClassLineGroup[] | null
    >(null);
  
    const [classLoading, setclassLoading] = useState(false);
    const [channelLoading, setChannelLoading] = useState(false);
  
    const toast = useToast();
    const session = useSession();
    const { selectedSemester } = useSemester();
  
    const getClassesSubjects = (classes: Class[]) => {
      const subjectSet = new Set<string>();
  
      for (const cls of classes) {
        subjectSet.add(cls.subject);
      }
  
      setSubjects(Array.from(subjectSet));
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
              getClassesSubjects(filteredClasses);
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
    };

    useEffect(() => {
        if (classes.length > 0 && channels.length > 0) {
          let remainingClassIds = new Set(formData.trigger_recipients.split(','));
          let newSelectedChannels : string[] = [];
          let newSelectedClasses : string[] = [];
    
          channels.forEach(channel => {
            const channelClassIds = new Set(channel.channel_subscribers);
            if (Array.from(channelClassIds).every(id => remainingClassIds.has(id))) {
              newSelectedChannels.push(channel.channel_id);
              channelClassIds.forEach(id => remainingClassIds.delete(id));
            }
          });
    
          classes.forEach(cls => {
            if (remainingClassIds.has(cls.id)) {
              newSelectedClasses.push(cls.id);
              remainingClassIds.delete(cls.id);
            }
          });
    
          setSelectedChannels(newSelectedChannels);
          setSelectedClasses(newSelectedClasses);
    
          if (remainingClassIds.size > 0) {
            setWarningMessage("One or more previously included classes are no longer available for selection");
          }
        }
      }, [classes, channels, formData.trigger_recipients]);
  
    const clearAll = () => {
      /*
      Clear all selected classes and channels too here
      */
      setSubjects([]);
    };
  
    useEffect(() => {
      fetchData();
      clearAll();
    }, [selectedSemester]);
  
    const isEmptyString = (str: string) => {
      const s = str.trim();
      return !s || s.length == 0;
    };
  
    const sendData = async (submitData: FormData) => {
      if (!(session.data?.user.id)) {
        toast({
          title: "Error! Unauthorized access",
          status: "error",
          isClosable: true,
        });
        return;
      }
      setLoading(true);
  
      try {
        await updateAutoResponse(
          formData.id,
          formData.name,
          formData.is_enabled,
          formData.response_message,
          formData.trigger_recipients,
          formData.trigger_type,
          formData.trigger_words,
          session.data?.user.id
        );
        toast({
          title: "Succesfully created a new message template!",
          status: "success",
          isClosable: true,
        });
      } catch (error) {
        console.log(error);
        toast({
          title: "Error! Unable to create message template right now",
          status: "error",
          isClosable: true,
        });
      }
  
      setLoading(false);
    };
    
    const handleSubmit = (e: SyntheticEvent) => {
      e.preventDefault();
      setError("");
      if (
        isEmptyString(formData.name) ||
        isEmptyString(formData.response_message) ||
        isEmptyString(formData.trigger_recipients) ||
        isEmptyString(formData.trigger_words)
      ){
        setError("Fields should be filled and at least one recipient must be selected!");
        return;
      }
    
      sendData(formData);
    };
  
    const handleRecipientChange = (selectedClasses: string[], selectedChannels: string[]) => {
      const allClassIds = new Set<string>(selectedClasses);
  
      selectedChannels.forEach(channelId => {
        const channel = channels.find(c => c.channel_id === channelId);
        if (channel) {
          channel.channel_subscribers.forEach(classId => {
            allClassIds.add(classId);
          });
        }
      });
  
      setFormData({
        ...formData,
        trigger_recipients: Array.from(allClassIds).join(',')
      });
    };
  
    const handleCancel = () => {};
    
  
    const header = (
      <Flex alignItems="center" gap={2}>
        <span>Edit Auto Response</span>
      </Flex>
    );
    const body = (
      <Box gap="2" display="Flex" flexDirection="column">
        <Box>Name</Box>
        <Input
          value={formData.name}
          onChange={(e) =>
            setFormData(() => ({
              ...formData,
              name: e.target.value,
            }))
          }
        />
  
        <HStack>
          <Box>Enabled</Box>
          <Switch isChecked={formData.is_enabled} onChange={(e) =>
              setFormData(() => ({
                ...formData,
                is_enabled: e.target.checked,
              }))
            }/>
        </HStack>
        
  
        <Box>Trigger Type</Box>
        <Select
          backgroundColor={"white"}
          width={"100%"}
          defaultValue="all"
          onChange={(event) =>
            setFormData({
              ...formData,
              trigger_type: event.target.value,
            })
          }
        >
          <option value="contains">CONTAINS</option>
          <option value="equals">EQUALS</option>
        </Select>
        <Box>
          Trigger Words
          <Text fontSize={"sm"} color={"red.400"}>Words are separated by comma; e.g: hello,world,bot</Text>
          </Box>
        <Input
          value={formData.trigger_words}
          onChange={(e) =>
            setFormData(() => ({
              ...formData,
              trigger_words: e.target.value,
            }))
          }
        />
        <Box>Message</Box>
        <Textarea
          id="messageContent"
          value={formData.response_message}
          onChange={(e) =>
            setFormData(() => ({
              ...formData,
              response_message: e.target.value,
            }))
          }
        />
  
        <Divider/>

        {warningMessage && (
            <Text fontSize="sm" color="red.500">
            {warningMessage}
            </Text>
        )}
  
        <EnhancedMultiSelect
          selectedChannels={selectedChannels}
          selectedClasses={selectedClasses}
          setSelectedChannels={setSelectedChannels}
          setSelectedClasses={setSelectedClasses}
          channels={channels}
          classes={classes}
          handleRecipientChange={handleRecipientChange} 
        />
      </Box>
    );
  
    const footer = (
      <Box className="flex flex-col w-full items-center">
        {error && error.length >= 1 ? (
          <Box
            fontSize={["sm", "md"]}
            className="mb-2 px-1 py-2 text-white bg-red-600 w-full text-center font-bold"
          >
            {error}
          </Box>
        ) : null}
        <Box className="flex gap-2 justify-start w-full">
          <Button
            onClick={handleSubmit}
            colorScheme="twitter"
            isLoading={loading}
            loadingText="Creating..."
          >
            Save
          </Button>
        </Box>
      </Box>
    );
  
    return (
      <ModalTemplate
        isOpen={props.isOpen}
        onClose={props.onClose}
        header={header}
        body={body}
        footer={footer}
      />
    );
};

export default EditAutoResponse;
