import React, { useState, ChangeEvent } from "react";
import { HStack, Button } from "@chakra-ui/react";
import { PinInput, PinInputField } from "@chakra-ui/react";

type CustomInputProps = {
  onSubmit: (value: string) => void;
};

function CustomInput({ onSubmit }: CustomInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSubmitButton, setShowSubmitButton] = useState(false);

  // Function to handle input change
  const handleInputChange = (value: string) => {
    setInputValue(value);

    // Show the submit button when there are 4 characters
    setShowSubmitButton(value.length === 4);
  };

  // Function to handle form submission
  const handleSubmit = () => {
    // Call the onSubmit callback with the input value
    if (onSubmit) {
      onSubmit(inputValue);
    }
  };

  return (
    <HStack>
      <PinInput
        value={inputValue}
        onChange={handleInputChange}
        isInvalid={inputValue.length !== 4 && inputValue.length !== 0}
      >
        <PinInputField />
        <PinInputField />
        <PinInputField />
        <PinInputField />
      </PinInput>
      {showSubmitButton && (
        <Button colorScheme="teal" onClick={handleSubmit}>
          Link
        </Button>
      )}
    </HStack>
  );
}

export default CustomInput;
