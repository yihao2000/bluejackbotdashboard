import { MessageTemplate } from "@/app/interfaces/interfaces";
import React from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
} from "@chakra-ui/react";

type Props = {
  data: MessageTemplate;
  openDetail: (id: string) => void
};

const MessageTemplateCard = (props: Props) => {
  return (
    <Card className="hover:cursor-pointer hover:scale-105 transition">
      <CardHeader>
        <Heading size="md">
          {props.data.name}
        </Heading>
      </CardHeader>
      <CardBody py={0}>
        <Box display="flex" className="items-center gap-2">
          <Text fontSize="sm">{props.data.content}</Text>
        </Box>
        <Box display="flex" className="items-center gap-2">
          <Text
            fontWeight="bold"
            fontSize="sm"
            color={"green"}
          >
            {props.data.category}
          </Text>
        </Box>
      </CardBody>
      <CardFooter>
        <Button colorScheme="blue">
          Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MessageTemplateCard;
