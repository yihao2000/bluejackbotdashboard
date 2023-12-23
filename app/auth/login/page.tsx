"use client";

// import Nav from "./components/navbar";
import {
  Box,
  Button,
  Image,
  Input,
  useColorMode,
  InputGroup,
  InputLeftElement,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ParticlesBackground from "@/app/components/background/ParticlesBackground";
import { FaUser, FaLock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

function LoginBox() {
  const toast = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isError, setIsError] = useState("");

  const logIn = async () => {
    const result = await signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
    });
    // console.log(result)
    if (result?.error == null) {
      window.location.replace("/");
    } else {
      
      setIsError(result.error);
      // toast({
      //   title: "Error",
      //   description: result?.error,
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      // });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    logIn();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box className="flex items-center justify-center min-h-screen">
        <Box bg="white" padding="8" className="relative">
          <Image
            src="/ribbon.png"
            className="absolute top-0 left-2 w-8"
          ></Image>
          <Box boxSize="28" marginLeft="4">
            <Image
              src="/binuslogo.png"
              alt="Logo"
              objectFit="cover"
              borderRadius="none"
            ></Image>
          </Box>
          <Box>
            <InputGroup>
              <InputLeftElement>
                <FaUser
                  style={{
                    color: "grey",
                  }}
                />
              </InputLeftElement>
              <Input
                mb="2"
                placeholder="Username"
                borderRadius="none"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </InputGroup>
          </Box>
          <Box>
            <InputGroup>
              <InputLeftElement>
                <FaLock
                  style={{
                    color: "grey",
                  }}
                />
              </InputLeftElement>
              <Input
                mb="2"
                placeholder="Password"
                borderRadius="none"
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </InputGroup>
          </Box>
          <Box justifyContent="center" width="full" display="flex">
            <Button
              mb="2"
              width="full"
              bg="secondary.50"
              variant="solid"
              color="white"
              borderRadius="none"
              _hover={{ bg: "secondary.100" }}
              type="submit"
            >
              Login
            </Button>
          </Box>
          {isError != "" && (
            <Box
              justifyContent="center"
              width="full"
              display="flex"
              backgroundColor="red"
              p="3"
              color="white"
            >
              {isError}
            </Box>
          )}
        </Box>
      </Box>
    </form>
  );
}

export default function Login() {
  return (
    <>
      <ParticlesBackground />
      <LoginBox />
    </>
  );
}
