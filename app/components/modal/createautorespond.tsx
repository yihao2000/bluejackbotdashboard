import { AutoResponse } from "@/app/interfaces/interfaces";
import React, { useState } from "react";
import ModalTemplate from "./ModalTemplate";
import {
  Box,
  Button,
  InputGroup,
  InputRightElement,
  Select,
  Input,
  Checkbox,
  Flex,
  Textarea,
  Text,
} from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: AutoResponse) => void;
  onFail?: () => void;
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
  trigger_type: "",
  trigger_words: "",
  trigger_recipients: "",
  response_message: "",
  is_enabled: false,
};

const CreateAutoRespond = (props: Props) => {
  const [formData, setFormData] = useState<FormData>(defaultData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = () => {};

  const handleCancel = () => {};

  const header = (
    <Flex alignItems="center" gap={2}>
      <span>Create Auto Responder</span>
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
      <Box>Recipient</Box>
      <Select
        backgroundColor={"white"}
        width={"100%"}
        defaultValue="all"
        onChange={(event) =>
          setFormData({
            ...formData,
            trigger_recipients: event.target.value,
          })
        }
      >
        <option value="1">CLASS 1</option>
        <option value="2">CLASS 2</option>
      </Select>

      <Box>Set to Global</Box>
      <Checkbox
        checked={formData.is_enabled}
        onChange={(e) =>
          setFormData(() => ({
            ...formData,
            is_enabled: e.target.checked,
          }))
        }
      />

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
        <Text fontSize={"sm"} color={"red.400"}>Words are seperated by comma; e.g: hello,world,bot</Text>
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
        <Button onClick={handleCancel} colorScheme="red">
          Cancel
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

export default CreateAutoRespond;
