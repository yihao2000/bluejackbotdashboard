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
  openDetail: (id: string) => void;
};

const MessageTemplateCard = (props: Props) => {
  return (
    <Card className="hover:cursor-pointer hover:scale-105 transition" size={"md"}>
      <CardHeader>
        <Heading size={["sm","md"]}>{props.data.name}</Heading>
      </CardHeader>
      <CardBody py={0}>
        <Box display="flex" className="items-center py-1">
          <Text fontSize={["xs","sm"]} noOfLines={[1, 3]}>
            {props.data.content} Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Eos illum nulla expedita facilis magni dolores
            adipisci atque necessitatibus asperiores rem, reiciendis vel dolor
            delectus excepturi consequatur? Sint libero ex animi?
          </Text>
        </Box>
        <Box display="flex" className="items-center py-1">
          <Text fontWeight={["semibold","bold"]} fontSize={["xs","sm"]} color={"green"}>
            {props.data.category}
          </Text>
        </Box>
      </CardBody>
      <CardFooter>
        <Button
          colorScheme="blue"
          onClick={() => props.openDetail(props.data.id)}
        >
          Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MessageTemplateCard;
