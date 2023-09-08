import React, { useState, ChangeEvent } from "react";
import { Input, HStack, Button } from "@chakra-ui/react";

type CustomInputProps = {
  onSubmit: (value: string) => void;
};

function CustomInput({ onSubmit }: CustomInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSubmitButton, setShowSubmitButton] = useState(false);

  // Function to handle input change
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Check if the input contains only numeric characters
    if (value.length < 7) {
      if (/^\d*$/.test(value)) {
        setInputValue(value);

        // Show the submit button when there are 6 characters
        setShowSubmitButton(value.length === 6);
      }
    }
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
      <Input
        placeholder="Enter 6 digit code"
        value={inputValue}
        onChange={handleInputChange}
        isInvalid={inputValue.length !== 6 && inputValue.length !== 0}
      />
      {showSubmitButton && (
        <Button colorScheme="teal" onClick={handleSubmit}>
          Link
        </Button>
      )}
    </HStack>
  );
}

export default CustomInput;
