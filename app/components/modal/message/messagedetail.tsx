import { MessageTemplate } from "@/app/interfaces/interfaces";
import { Box, Button, Divider, Flex, Text, Wrap, WrapItem } from "@chakra-ui/react";
import React from "react";
import ModalTemplate from "../ModalTemplate";
import { parseContent } from "@/app/utils/formatter";

type Props = {
  data: MessageTemplate | undefined;
  show: boolean;
  onClose: () => void;
  toDelete: boolean;
};

const MessageDetail = (props: Props) => {
  const header = (
    <Flex alignItems="center" gap={2}>
      <span>Template Details</span>
    </Flex>
  );

  const body = (
    <Box className="flex gap-2 flex-col p-2">
      {props.data ? (
        <>
          <Box display={"vertical"}>
            <Box fontWeight={"semibold"}>Name</Box>
            <Text fontWeight={"bold"} fontSize={{base: "xl"}} color={"blue.400"}>
              {props.data.name}
            </Text>
          </Box>

          <Box display={"flex"} flexDirection={"column"}>
            <Box fontWeight={"semibold"}>Content</Box>
            <Box maxHeight={"20rem"} overflowY={"auto"} className="py-2 px-1">
            <Box 
                border="1px solid" 
                borderColor="blue.300" 
                borderRadius="lg" 
                p="4" 
                my="1" 
                bg="blue.50"
            >
              <Wrap>
                {parseContent(props.data.raw_content).map((element, index) => (
                    <WrapItem key={index}>
                        {typeof element === 'string' ? <Text fontSize={["xs","sm"]}>{element}</Text> : element}
                    </WrapItem>
                ))}
              </Wrap>
            </Box>
            </Box>
          </Box>

          {props.data.category ? (
            <Box display={"vertical"}>
              <Box fontWeight={"semibold"}>Category</Box>
              <Text color={"green.400"} fontWeight={"bold"}>
                {props.data.category}
              </Text>
            </Box>
          ) : null}

          {props.data.data_map.size > 0 ? (
            <Box display={"flex"} flexDirection={"column"} width={"100%"}>
              <Box fontWeight={"semibold"}>Template Variables</Box>
              {Array.from(props.data.data_map.keys()).map((key, i) => (
                <Text>{`${key} -> ${props.data?.data_map.get(key)}`}</Text>
              ))}
            </Box>
          ) : null}

          <Divider p="2" />
          <Button colorScheme="blue">Use</Button>
        </>
      ) : (
        <Text>
          <b>Data not Found</b>
        </Text>
      )}
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
