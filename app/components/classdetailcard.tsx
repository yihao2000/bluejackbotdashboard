import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Class, ClassDetail, ClassLineGroup } from "../interfaces/interfaces";
import { PiClipboardTextLight } from "react-icons/pi";
import { RiGroupLine } from "react-icons/ri";
import { GrStatusGood } from "react-icons/gr";
import LINELogo from "./customlogo";
import ClassDetailModal from "./modal/classdetailmodal";
import GroupCodeModal from "./modal/groupcodemodal";

interface Data {
  classDetail: ClassDetail;
  refreshPage: () => void;
}
export default function ClassDetailCard(props: Data) {
  const classDetailModalDisclosure = useDisclosure();
  const groupCodeModalDisclosure = useDisclosure();

  return (
    <Card
      // maxW={"md"}
      className="hover:cursor-pointer hover:scale-105 transition"
    >
      <CardHeader>
        <Heading size="md">{props.classDetail.coursename}</Heading>
      </CardHeader>
      <CardBody py={0}>
        <Box display="flex" className="items-center gap-2">
          <PiClipboardTextLight />
          <Text fontSize="sm">{props.classDetail.code}</Text>
        </Box>
        <Box display="flex" className="items-center gap-2">
          <RiGroupLine />
          <Text fontSize="sm">{props.classDetail.classname}</Text>
        </Box>
        <Box display="flex" className="items-center gap-2">
          <Image src="/linelogo.svg" />
          <Text fontSize="sm">
            {props.classDetail.class_line_group_id == null
              ? "Unlinked"
              : "Linked"}
          </Text>
        </Box>
      </CardBody>
      <CardFooter>
        {/* {props.classDetail.class_line_group_id != null ? ( */}
        <Button onClick={classDetailModalDisclosure.onOpen}>
          {props.classDetail.class_line_group_id == null ? "Link" : "Details"}
        </Button>
        {/* ) : ( */}
        {/* <Button onClick={groupCodeModalDisclosure.onOpen}>Link</Button> */}
        {/* )} */}
      </CardFooter>

      <ClassDetailModal
        {...classDetailModalDisclosure}
        classDetail={props.classDetail}
        refreshPage={props.refreshPage}
      />
      {/* <GroupCodeModal
        {...groupCodeModalDisclosure}
        classDetail={props.classDetail}
        refreshPage={props.refreshPage}
      /> */}
    </Card>
  );
}
