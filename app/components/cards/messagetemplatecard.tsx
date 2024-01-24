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
  CloseButton,
  HStack,
  Heading,
  Text,
  Wrap,
  WrapItem,
  useDisclosure,
} from "@chakra-ui/react";
import { parseContent } from "@/app/utils/formatter";
import { deleteTemplate } from "@/app/utils/constants";
import { ConfirmationModal } from "../modal/confirmationmodal";
import { useSession } from "next-auth/react";

type Props = {
  data: MessageTemplate;
  openDetail: (id: string) => void;
  refreshPage: () => void;
};

const MessageTemplateCard = (props: Props) => {
  const confirmationModalDisclosure = useDisclosure();

  function openDeleteModal() {
    confirmationModalDisclosure.onOpen();
  }

  const handleDeleteButtonClick = () => {
    openDeleteModal();
  };

  const { data } = useSession();

  const handleDeleteTemplate = (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      deleteTemplate(props.data.id)
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
    <Card className="hover:cursor-pointer hover:scale-105 transition" size={"md"}>
      <CardHeader>
        <HStack>
          <Heading size={["sm","md"]}>{props.data.name}</Heading>
          {(data?.user.id && props.data.owner_id == data?.user.id) &&
            <CloseButton
                size="sm"
                position="absolute"
                top="1rem"
                right="1rem"
                onClick={() => {
                  handleDeleteButtonClick();
                }}
              />
          }
        </HStack>
        {
          props.data.is_shared == 1 ? <Badge colorScheme="green" px={2} borderRadius="md">Global</Badge> :
          props.data.is_shared == 0 ? <Badge colorScheme="orange" px={2} borderRadius="md">Private</Badge> : ''
        }
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
              {parseContent(props.data.raw_content).map((element, index) => (
                  <>
                      {element}
                  </>
              ))}
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
      <ConfirmationModal
        {...confirmationModalDisclosure}
        title="Delete Confirmation"
        description="Are you sure you want to delete selected template?"
        action={handleDeleteTemplate}
        refreshPage={props.refreshPage}
        successMessage="Message template successfully deleted!"
        errorMessage="Failed to delete message template!"
      />
    </Card>
  );
};

export default MessageTemplateCard;