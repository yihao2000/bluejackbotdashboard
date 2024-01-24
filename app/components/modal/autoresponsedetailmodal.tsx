import { AutoResponse, MessageTemplate, RoomClass } from "@/app/interfaces/interfaces";
import { Badge, Box, Button, Divider, Flex, Skeleton, Text, Wrap, WrapItem } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ModalTemplate from "./ModalTemplate";
import { parseContent, transformStudentClassResponse } from "@/app/utils/formatter";
import { useSession } from "next-auth/react";
import { queryStudentClass } from "@/app/utils/constants";

type Props = {
  data: AutoResponse | undefined;
  show: boolean;
  onClose: () => void;
  onEdit: () => void;
  toDelete: boolean;
};

export type GroupedClasses = {
    [subject: string]: string[];
};

const groupClassesBySubject = (classList: RoomClass[]): GroupedClasses => {
    const grouped: GroupedClasses = {};
    classList.forEach((item) => {
      if (!grouped[item.subject]) {
        grouped[item.subject] = [];
      }
      grouped[item.subject].push(item.class);
    });
    return grouped;
  };

const AutoResponseDetail = (props: Props) => {
  const header = (
    <Flex alignItems="center" gap={2}>
      <span>Auto Response Details</span>
    </Flex>
  );

  const { data } = useSession();

  const [studentClassList, setStudentClassList] = useState<RoomClass[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getStudentClass = async () => {
    setIsLoading(true);
    try {
      const results = await Promise.all(
        (props.data?.trigger_recipients.split(',') as string[]).map(async (x) => {
          if (x) {
            const res = await queryStudentClass(x);

            res.response.id = x;

            console.log(res);
            return res;
          }
          return null;
        })
      ).finally(() => {
        setIsLoading(false);
      });
      setStudentClassList(transformStudentClassResponse(results));
    } catch (error) {
      console.error("Error fetching student class:", error);
    }
  };

  useEffect(() => {
    if (props.data?.trigger_recipients[0] != null) {
      getStudentClass();
    }
  }, [props.data?.trigger_recipients]);

  const groupedClasses = groupClassesBySubject(studentClassList);

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
                whiteSpace={'pre-wrap'}
            >
                {props.data.response_message}
            </Box>
            </Box>
          </Box>

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

            <Text fontWeight="semibold" display="flex" alignItems="center">
                Classes
            </Text>
            <Box className="gap-3" maxHeight={200} overflowY={'auto'}>
                {isLoading ? (
                    <Skeleton width="20" height="20px" />
                ) : Object.keys(groupedClasses).length > 0 ? (
                    Object.entries(groupedClasses).map(([subject, classes]) => (
                        <Box
                            p={3}
                            boxShadow="md"
                            borderWidth="1px"
                            borderRadius="lg"
                            overflow="hidden"
                            mb={3}
                            bg="white"
                            key={subject}
                        >
                            <Text fontWeight="bold" fontSize="md">{subject}</Text>
                            <Box
                            display="flex"
                            flexWrap="wrap">
                                {classes.map((className: string, index: number) => (
                                    <Badge m={1} colorScheme="twitter">
                                        <Text fontSize="sm" key={index}>
                                            {className}
                                        </Text>
                                    </Badge>
                                ))}
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Text color="gray" fontSize="sm">
                        No classes selected
                    </Text>
                )}
            </Box>

            <Button
              colorScheme="blue"
              onClick={() => props.onEdit()}
            >
              Edit
            </Button>
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

export default AutoResponseDetail;
