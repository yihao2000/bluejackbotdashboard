import React, { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  CloseButton,
  Skeleton,
  Text
} from "@chakra-ui/react";
import { RoomClass, ScheduledMessage } from '@/app/interfaces/interfaces';
import { convertAndAdjustDate, parseContent, transformStudentClassResponse } from '@/app/utils/formatter';
import { GroupedClasses } from '../modal/autoresponsedetailmodal';
import { queryStudentClass } from '@/app/utils/constants';

type ScheduledMessageCardProps = {
  scheduledMessage: ScheduledMessage;
  removeButtonClick: (data: ScheduledMessage) => void;
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

const ScheduledMessageCard = ({ scheduledMessage, removeButtonClick }: ScheduledMessageCardProps) => {
    const [studentClassList, setStudentClassList] = useState<RoomClass[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const groupedClasses = groupClassesBySubject(studentClassList);

    const getStudentClass = async () => {
      setIsLoading(true);
      try {
        const results = await Promise.all(
          (scheduledMessage.recipients_string.split(',') as string[]).map(async (y) => {
            if (y) {
              const res = await queryStudentClass(y);
  
              res.response.id = y;
  
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
      if (scheduledMessage.recipients_string[0] != null) {
        getStudentClass();
      }
    }, [scheduledMessage.recipients_string]);

  return (
    <Card
      borderRadius="xl"
      _hover={{ background: "#f7f7f7" }}
    >
      <CardHeader fontWeight="bold">
        Scheduled for {" "}
        <Text display="inline" color="grey" fontSize="md">
          {convertAndAdjustDate(scheduledMessage.time)}
        </Text>
        <CloseButton
          size="md"
          position="absolute"
          right="0"
          top="0"
          m="2"
          onClick={() => removeButtonClick(scheduledMessage)}
        />
      </CardHeader>
      <CardBody pt="0" m="0">
        <Text fontWeight="semibold" display="flex" alignItems="center">
            Recipients
        </Text>
        <Box className="gap-3" maxHeight={200} overflowY={'auto'} borderRadius={10}>
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

        <Box display={"flex"} flexDirection={"column"} mt={5}>
            <Box fontWeight={"semibold"}>Message</Box>
            <Box maxHeight={"20rem"} overflowY={"auto"} className="py-2 px-1">
            <Box 
                border="1px solid" 
                borderColor="blue.300" 
                borderRadius="lg" 
                p="4" 
                my="1" 
                bg="blue.50"
            >
                {parseContent(scheduledMessage.content).map((element, index) => (
                    <>
                        {element}
                    </>
                ))}
            </Box>
            </Box>
            </Box>
        </CardBody>
    </Card>
  );
};

export default ScheduledMessageCard;
