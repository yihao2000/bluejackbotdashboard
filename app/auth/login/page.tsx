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
} from "@chakra-ui/react";
import { useEffect } from "react";
import ParticlesBackground from "@/app/components/background/ParticlesBackground";
import { FaUser, FaLock } from "react-icons/fa";
import { useRouter } from "next/navigation";

function LoginBox() {
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Hai");
    await router.replace("/");
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
              <Input mb="2" placeholder="Username" borderRadius="none" />
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
              />
            </InputGroup>
          </Box>
          <Box justifyContent="center" width="full" display="flex">
            <Button
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
