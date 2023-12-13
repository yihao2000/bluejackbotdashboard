import React from "react";
import { Button, useToast } from "@chakra-ui/react";

interface AnimatedButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  onClick,
  isLoading,
}) => {
  const toast = useToast();

  const handleAnnounceClick = () => {
    onClick(); // Call the onClick function passed as a prop
  };

  return (
    <Button
      onClick={handleAnnounceClick}
      colorScheme="green"
      isLoading={isLoading}
    >
      Announce
    </Button>
  );
};

export default AnimatedButton;
