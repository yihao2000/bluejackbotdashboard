import { AutoResponse, MessageTemplate } from "@/app/interfaces/interfaces";
import React from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Heading,
  Text,
} from "@chakra-ui/react";

type Props = {
  data: AutoResponse;
  openDetail: (id: string) => void;
};

const AutoResponseCard = (props: Props) => {
  return (
    <Card className="hover:cursor-pointer hover:scale-105 transition" size="md">
        <CardHeader>
            <Heading size={["sm","md"]}>{props.data.name}</Heading>
        </CardHeader>
        <CardBody py={0}>
            <Box 
                border="1px solid" 
                borderColor="blue.300" 
                borderRadius="lg" 
                p="4" 
                my="2" 
                bg="blue.50"
            >
                <Text 
                    fontSize={{ base: "xs", md: "sm" }} 
                    noOfLines={[1, 3]}
                >
                    {props.data.response_message}
                </Text>
            </Box>
            <Divider/>
            <Box my="2">
                <Text fontWeight="semibold" display="flex" alignItems="center">
                    Triggers when a message <Text color="green.500" ml="2">{props.data.trigger_type}</Text>
                </Text>
                <Box display="flex" flexWrap="wrap" alignItems="center" mt="2">
                    {props.data.trigger_words?.map((word, index) => (
                        <Badge key={index} mx="1" my="1" colorScheme="purple">
                            {word}
                        </Badge>
                    ))}
                </Box>
            </Box>
            <Divider/>
            <Text fontSize={{ base: "sm", md: "md" }} noOfLines={[1, 3]} my="2">
                Currently active in {<Badge mx="1" my="1" colorScheme="orange" fontSize={{base: "md"}}>
                            {props.data.trigger_recipients.split(',')?.length}
                        </Badge>} classes
            </Text>
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

export default AutoResponseCard;
