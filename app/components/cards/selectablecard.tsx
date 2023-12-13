import React from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { Class } from "@/app/interfaces/interfaces";
import { transformClassSubjectFormat } from "@/app/utils/formatter";
import { PiClipboardTextLight } from "react-icons/pi";
import { RiGroupLine } from "react-icons/ri";
import { MdOutlineMeetingRoom } from "react-icons/md";

type CardProps = {
  currentClass: Class;
  onClick: () => void;
  isSelected: boolean;
};

function SelectableCard({ currentClass, onClick, isSelected }: CardProps) {
  return (
    <Box
      minWidth="md"
      p={5}
      maxWidth="md"
      shadow="md"
      borderWidth="1px"
      borderRadius="md"
      bg={isSelected ? "blue.50" : useColorModeValue("white", "gray.800")}
      borderColor={isSelected ? "blue.500" : "gray.300"}
      cursor="pointer"
      onClick={() => onClick()}
    >
      <Box mb="2">
        <Text fontSize="lg" fontWeight="bold">
          {transformClassSubjectFormat(currentClass.subject)}
        </Text>
      </Box>
      <Box display="flex" className="items-center gap-2">
        <PiClipboardTextLight />
        <Text fontSize="sm">{currentClass.class}</Text>
      </Box>
      <Box display="flex" className="items-center gap-2">
        <RiGroupLine />
        <Text fontSize="sm">{currentClass.assistant}</Text>
      </Box>
      <Box display="flex" className="items-center gap-2">
        <MdOutlineMeetingRoom />
        <Text fontSize="sm">{currentClass.room}</Text>
      </Box>
    </Box>
  );
}

export default SelectableCard;
