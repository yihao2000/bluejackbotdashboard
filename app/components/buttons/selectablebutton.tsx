import React from "react";
import { Button, Box, ButtonProps } from "@chakra-ui/react";
import { Class } from "@/app/interfaces/interfaces";

interface SelectableButtonProps {
  label: string;
  selectedClasses: string[];
  classesList: Class[]; // Replace 'Class' with the actual type for your 'classesList'
  handleButtonClick: () => void;
  course?: string;
  colorScheme: ButtonProps["colorScheme"]; // Use the ButtonProps type for 'colorScheme'
}

const SelectableButton: React.FC<SelectableButtonProps> = ({
  label,
  selectedClasses,
  classesList,
  handleButtonClick,
  course,
  colorScheme,
}) => (
  <Button
    fontSize="sm"
    onClick={handleButtonClick}
    variant="outline"
    colorScheme={colorScheme}
  >
    {label}
  </Button>
);

export { SelectableButton };
