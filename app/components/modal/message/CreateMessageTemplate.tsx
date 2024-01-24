"use client";
import { MessageTemplate } from "@/app/interfaces/interfaces";
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
} from "@chakra-ui/react";
import React, { SyntheticEvent, useState } from "react";
import ModalTemplate from "../ModalTemplate";
import { AiOutlinePlus } from "react-icons/ai";
import { createMessageTemplate } from "@/app/utils/constants";
import { useSession } from "next-auth/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: MessageTemplate) => void;
  onFail: () => void;
};

type ParamType = {
  name: string;
  type: string;
};

type FormData = {
  name: string;
  category: string;
  content: string;
  is_global: boolean;
  // data_map: Map<string, string>;
};

const defaultData = {
  name: "",
  category: "",
  content: "",
  is_global: false,
  // data_map: new Map<string, string>(),
};

const fixedParams = ["Class Code", "Class Name", "Course Code", "Course Name"];

const CreateMessageTemplate = (props: Props) => {
  const [formData, setFormData] = useState<FormData>(defaultData);
  const [loading, setLoading] = useState(false);
  const [param, setParam] = useState<ParamType>({
    name: "",
    type: "free",
  });
  const [error, setError] = useState("");
  const { data } = useSession();
  const isEmptyString = (str: string) => {
    const s = str.trim();
    return !s || s.length == 0;
  };

  const toast = useToast();

  const isDuplicateParams = (content: string) => {
    const splits = content.split("{?");
    const map = new Map<string, string>();
    for (let i = 0; i < splits.length; i++) {
      const str = splits[i];
      if (str.trim() !== "") {
        const data = str.substring(0, str.indexOf("}"));
        if (data.trim() !== "") {
          const d = data.split("#");
          if (map.has(d[0])) {
            return {
              isDuplicate: true,
              map: undefined,
            };
          }
          map.set(d[0], d[1]);
        }
      }
    }
    return {
      isDuplicate: false,
      map: map,
    };
  };

  const sendData = async (data_map: Map<string, string> | undefined) => {
    const map = data_map ?? new Map();
    if (!(data?.user.id)) {
      toast({
        title: "Error! Unable to create channel right now",
        status: "error",
        isClosable: true,
      });
      return;
    }
    setLoading(true);

    try {
      await createMessageTemplate(
        formData.name,
        formData.content,
        map,
        formData.is_global,
        formData.category,
        data?.user.id
      );
      toast({
        title: "Succesful!",
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error! Unable to create channel right now",
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
      isEmptyString(formData.category) ||
      isEmptyString(formData.content) ||
      isEmptyString(formData.name)
    ) {
      setError("Fields should be filled!");
      return;
    }
    const { isDuplicate, map: data_map } = isDuplicateParams(formData.content);
    if (isDuplicate) {
      setError("Content params should be unique!");
      return;
    }
    sendData(data_map);
  };

  const handleCancel = () => {
    setFormData(defaultData);
  };

  
  const insertParam = () => {
    if (!param.name || param.name.trim() === "") {
      return;
    }
    setError("");
    const p = param.name.trim();
    // if (formData.data_map.has(p)) {
      //   setError("Cannot insert duplicate param keys!");
      //   return;
      // }

      const textArea = document.getElementById(
      "messageContent"
      ) as HTMLTextAreaElement;
      const cursorPos = textArea.selectionStart;
      const prefix = formData.content.substring(0, cursorPos);
      const suffix = formData.content.substring(
        cursorPos,
        formData.content.length
        );
        const type = "#" + (param.type === "free" ? "free" : "fixed:" + param.type);
        const newString =
        prefix.trimEnd() + ` \{?${p + type}\} ` + suffix.trimStart();
        
        // const map = formData.data_map;
        // map.set(p, param.type);
        
        setFormData(() => ({
          ...formData,
          // data_map: map,
          content: newString,
        }));
      };
      
      const header = (
        <Flex alignItems="center" gap={2}>
          <span>New Message Template</span>
        </Flex>
      );
      const body = (
        <Box gap="2" display="Flex" flexDirection="column">
      <Box>Template Name</Box>
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
        <Box>Global Template (shared to others)</Box>
        <Switch isChecked={formData.is_global} onChange={(e) =>
              setFormData(() => ({
                ...formData,
                is_global: e.target.checked,
              }))
            }/>
      </HStack>
      

      <Box>Category</Box>
      <Input
        value={formData.category}
        onChange={(e) =>
          setFormData(() => ({
            ...formData,
            category: e.target.value,
          }))
        }
      />
      <Box>Content</Box>
      <Textarea
        id="messageContent"
        value={formData.content}
        onChange={(e) =>
          setFormData(() => ({
            ...formData,
            content: e.target.value,
          }))
        }
      />
      <Box className="flex py-1 gap-2">
        <InputGroup>
          <InputRightElement className="w-2/5">
            <Select
              placeholder="Select option"
              value={param.type}
              fontSize={["xs", "sm"]}
              onChange={(e) => {
                setParam({
                  ...param,
                  type: e.currentTarget.value,
                });
              }}
            >
              <option value="free">Based On User Input</option>
              {fixedParams.map((p, i) => (
                <option value={p} key={i}>
                  {p}
                </option>
              ))}
            </Select>
          </InputRightElement>
          <Input
            value={param.name}
            onChange={(e) => {
              const value = e.target.value;
              setParam({
                ...param,
                name: value,
              });
            }}
            placeholder="Params"
          />
        </InputGroup>
        <Button onClick={insertParam} isLoading={loading}>
          <AiOutlinePlus />
        </Button>
      </Box>
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
          Create
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

export default CreateMessageTemplate;
