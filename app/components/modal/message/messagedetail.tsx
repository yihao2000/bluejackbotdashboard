import { MessageTemplate } from "@/app/interfaces/interfaces";
import { Box, Button, Divider, Flex, Text } from "@chakra-ui/react";
import React from "react";
import ModalTemplate from "../ModalTemplate";

type Props = {
  data: MessageTemplate | undefined;
  show: boolean;
  onClose: () => void;
  toDelete: boolean;
};

const MessageDetail = (props: Props) => {
  const header = (
    <Flex alignItems="center" gap={2}>
      <span>Template Detail</span>
    </Flex>
  );

  const body = (
    <Box className="flex gap-2 flex-col p-2">
      {props.data ? (
        <>
          <Box display={"flex"}>
            <Box fontWeight={"semibold"}>Name :</Box>&nbsp;
            <Text fontWeight={"bold"} color={"blue.400"}>
              {props.data.name}
            </Text>
          </Box>

          <Box display={"flex"} flexDirection={"column"}>
            <Box fontWeight={"semibold"}>Content</Box>
            <Box maxHeight={"20rem"} overflowY={"auto"} className="py-2 px-1">
              {props.data.raw_content}
            </Box>
          </Box>

          {props.data.category ? (
            <Box display={"flex"}>
              <Box fontWeight={"semibold"}>Category :</Box>&nbsp;
              <Text color={"green.400"} fontWeight={"bold"}>
                {props.data.category}
              </Text>
            </Box>
          ) : null}

          {props.data.data_map.size > 0 ? (
            <Box display={"flex"} flexDirection={"column"} width={"100%"}>
              <Box fontWeight={"semibold"}>Data Map :</Box>
              {Array.from(props.data.data_map.keys()).map((key, i) => (
                <Text>{`${key} -> ${props.data?.data_map.get(key)}`}</Text>
              ))}
            </Box>
          ) : null}
          <Button colorScheme="blue">Use</Button>
        </>
      ) : (
        <Text>
          <b>Data not Found</b>
        </Text>
      )}
      <Divider p="2" />
    </Box>
  );

  const footer =
    props.toDelete && props.data ? (
      <Box flex="1" textAlign="right">
        <Text mb="2">
          Are you sure you want to remove <b>{props.data.name} </b>?
        </Text>
        <Button colorScheme="red">Confirm</Button>
        <Button ml="2">Cancel</Button>
      </Box>
    ) : null;

  return (
    <ModalTemplate
      isOpen={props.show}
      onClose={props.onClose}
      header={header}
      body={body}
      footer={footer}
    />
  );
};

export default MessageDetail;
