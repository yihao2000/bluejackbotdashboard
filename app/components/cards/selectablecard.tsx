import React from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { transformClassSubjectFormat } from "@/app/utils/formatter";
import { PiClipboardTextLight } from "react-icons/pi";
import { RiGroupLine } from "react-icons/ri";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { Channel, Class } from "@/app/interfaces/interfaces";

// ... (imports)

type SelectableCardProps = {
  data: Channel | Class;
  onClick: () => void;
  isSelected: boolean;
  itemType: "channel" | "class";
};

function SelectableCard({
  data,
  onClick,
  isSelected,
  itemType,
}: SelectableCardProps) {
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
          {itemType === "class"
            ? transformClassSubjectFormat((data as Class).subject)
            : itemType === "channel"
            ? (data as Channel).channel_name
            : null}
        </Text>
      </Box>
      {itemType === "class" && (
        <>
          <Box display="flex" className="items-center gap-2">
            <PiClipboardTextLight />
            <Text fontSize="sm">{(data as Class).class}</Text>
          </Box>
          <Box display="flex" className="items-center gap-2">
            <RiGroupLine />
            <Text fontSize="sm">{(data as Class).assistant}</Text>
          </Box>
          <Box display="flex" className="items-center gap-2">
            <MdOutlineMeetingRoom />
            <Text fontSize="sm">{(data as Class).room}</Text>
          </Box>
        </>
      )}
    </Box>
  );
}

export default SelectableCard;
