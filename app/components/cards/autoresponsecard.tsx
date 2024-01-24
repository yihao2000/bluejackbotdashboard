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
  CloseButton,
  Divider,
  HStack,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ConfirmationModal } from "../modal/confirmationmodal";
import { deleteAutoResponse } from "@/app/utils/constants";

type Props = {
  data: AutoResponse;
  openDetail: (id: string) => void;
  refreshPage: () => void;
};

const AutoResponseCard = (props: Props) => {
    const confirmationModalDisclosure = useDisclosure();

    function openDeleteModal() {
      confirmationModalDisclosure.onOpen();
    }
  
    const handleDeleteButtonClick = () => {
      openDeleteModal();
    };
  
    const handleDeleteAutoResponse = (): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        deleteAutoResponse(props.data.id)
          .then(() => {
            resolve();
          })
          .catch((err : any) => {
            console.error(err);
            reject(err);
          });
      });
    };

  return (
    <Card className="hover:cursor-pointer hover:scale-105 transition" size="md">
        <CardHeader>
            <HStack>
                <Heading size={["sm","md"]}>{props.data.name}</Heading>
                <CloseButton
                    size="sm"
                    position="absolute"
                    top="1rem"
                    right="1rem"
                    onClick={() => {
                    handleDeleteButtonClick();
                    }}
                />
            </HStack>
            {
                props.data.is_enabled ? <Badge colorScheme="green" px={2} borderRadius="md">Active</Badge> :
                <Badge colorScheme="red" px={2} borderRadius="md">Inactive</Badge>
            }
        </CardHeader>
        <CardBody py={0}>
            <Box 
                border="1px solid" 
                borderColor="blue.300" 
                borderRadius="lg" 
                p="4" 
                my="2" 
                bg="blue.50"
                whiteSpace={'pre-wrap'}
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
                Currently <b>{props.data.is_enabled ? 'active' : 'inactive'}</b> in {<Badge mx="1" my="1" colorScheme="orange" fontSize={{base: "md"}}>
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
        <ConfirmationModal
            {...confirmationModalDisclosure}
            title="Delete Confirmation"
            description="Are you sure you want to delete selected auto response?"
            action={handleDeleteAutoResponse}
            refreshPage={props.refreshPage}
            successMessage="Auto response successfully deleted!"
            errorMessage="Failed to delete auto response!"
        />
    </Card>
);
};

export default AutoResponseCard;
