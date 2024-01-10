import { AutoResponse, MessageTemplate } from "@/app/interfaces/interfaces";
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
  data: AutoResponse;
//   openDetail: (id: string) => void;
};

const AutoResponseCard = (props: Props) => {
  return (
    <Card className="hover:cursor-pointer hover:scale-105 transition" size={"md"}>
      <CardHeader paddingX={"1rem"} paddingY={"0.5rem"}>
        <Heading size={["sm","md"]}>{props.data.name}</Heading>
      </CardHeader>
      <CardBody py={0}>
        <Box display="flex" className="items-center py-1">
          <Text fontSize={["xs","sm"]} noOfLines={[1, 3]}>
            {props.data.response_message}
          </Text>
        </Box>
        <Box display="flex" className="items-center py-1">
          <Text fontSize={["xs","sm"]} noOfLines={[1, 3]}>
            To: {props.data.trigger_recipients}
          </Text>
        </Box>
        <Box display="flex" flexDirection={"column"} className="py-1" fontSize={["xs","sm"]}>
            <Box display="flex" className="items-center" fontWeight={["semibold","bold"]}>
                <Text>Type : </Text>
                <Text color={"green"}>
                    {props.data.trigger_type}
                </Text>
            </Box>
            <Box display={"flex"} flexWrap={"wrap"}>
                <div>Words :&nbsp;</div>
                {props.data.trigger_words?.map((w) => (
                    <>
                        <div>[{w}]</div>&nbsp;
                    </>
                ))}
            </Box>
        </Box>
      </CardBody>
      {/* <CardFooter>
        <Button
          colorScheme="blue"
          onClick={() => props.openDetail(props.data.id)}
        >
          Details
        </Button>
      </CardFooter> */}
    </Card>
  );
};

export default AutoResponseCard;
