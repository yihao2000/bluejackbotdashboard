import React from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";

type CardProps = {
  title: string;
  content: string;
  onClick: () => void;
  isSelected: boolean;
};

function SelectableCard({ title, content, onClick, isSelected }: CardProps) {
  return (
    <Box
      minWidth="xs"
      p={3}
      shadow="md"
      borderWidth="1px"
      borderRadius="md"
      bg={isSelected ? "blue.50" : useColorModeValue("white", "gray.800")}
      borderColor={isSelected ? "blue.500" : "gray.300"}
      cursor="pointer"
      onClick={() => onClick()}
    >
      <Text fontSize="lg" fontWeight="bold">
        {title}
      </Text>
      <Text mt={2}>{content}</Text>
    </Box>
  );
}

export default SelectableCard;
