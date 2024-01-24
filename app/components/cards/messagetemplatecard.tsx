import { MessageTemplate } from "@/app/interfaces/interfaces";
import React, { ReactNode } from "react";
import {
  Badge,
  BadgeProps,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { parseContent } from "@/app/utils/formatter";

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
          <Text fontWeight={["semibold","bold"]} fontSize={["xs","sm"]} color={"green"}>
            {props.data.category}
          </Text>
        </Box>
        <Box 
            border="1px solid" 
            borderColor="blue.300" 
            borderRadius="lg" 
            p="4" 
            my="2" 
            bg="blue.50"
        >
          <Box display="flex" className="items-center py-1">
            <Text fontSize={["xs","sm"]} noOfLines={[1, 3]}>
              <Wrap>
                {parseContent(props.data.raw_content).map((element, index) => (
                    <WrapItem key={index}>
                        {typeof element === 'string' ? <Text fontSize={["xs","sm"]}>{element}</Text> : element}
                    </WrapItem>
                ))}
            </Wrap>
            </Text>
          </Box>
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