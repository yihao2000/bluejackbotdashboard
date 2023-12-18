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
} from "@chakra-ui/react";
import React, { SyntheticEvent, useState } from "react";
import ModalTemplate from "../ModalTemplate";
import { AiOutlinePlus } from "react-icons/ai";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: MessageTemplate) => void;
  onFail: () => void;
};

type FormData = {
  name: string;
  category: string;
  content: string;
  data_map: Map<string, string> | undefined;
};

const defaultData = {
  name: "",
  category: "",
  content: "",
  data_map: undefined,
};

const AddMessage = (props: Props) => {
  const [formData, setFormData] = useState<FormData>(defaultData);
  const [loading, setLoading] = useState(false);
  const [param, setParam] = useState("");

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
  };

  const handleCancel = () => {
    setFormData(defaultData);
  };

  const header = (
    <Flex alignItems="center" gap={2}>
      <span>New Message Template</span>
    </Flex>
  );

  const insertParam = () => {
    if (!param || param.trim() === "") {
      return;
    }
    const textArea = document.getElementById(
      "messageContent"
    ) as HTMLTextAreaElement;
    const cursorPos = textArea.selectionStart;
    const prefix = formData.content.substring(0, cursorPos);
    const suffix = formData.content.substring(
      cursorPos,
      formData.content.length
    );

    const newString = prefix.trimEnd() + ` \{?${param.trim()}\} ` + suffix.trimStart();
    setFormData(() => ({
      ...formData,
      content: newString,
    }));
  };

  const body = (
    <Box gap="2" display="Flex" flexDirection="column">
      <Box>Channel Name</Box>
      <Input
        value={formData.name}
        onChange={(e) =>
          setFormData(() => ({
            ...formData,
            name: e.target.value,
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

      <Box className="flex py-1">
        <InputGroup>
          <InputRightElement
            className="cursor-pointer"
            onClick={() => insertParam()}
          >
            <AiOutlinePlus />
          </InputRightElement>
          <Input
            value={param}
            onChange={(e) => {
              const value = e.target.value;
              setParam(value);
            }}
            placeholder="Params"
          />
        </InputGroup>
      </Box>
    </Box>
  );

  const footer = (
    <>
      <Button
        onClick={handleSubmit}
        colorScheme="twitter"
        isLoading={loading}
        loadingText="Creating..."
      >
        Create
      </Button>
      <Button onClick={handleCancel} colorScheme="red">
        Cancel
      </Button>
    </>
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

export default AddMessage;
