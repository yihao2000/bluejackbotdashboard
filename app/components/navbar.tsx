"use client";

import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Image,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiMenu,
  FiChevronDown,
} from "react-icons/fi";

import { AiOutlineMessage, AiOutlineSetting } from "react-icons/ai";
import { IconType } from "react-icons";

import React, { ReactNode, useEffect } from "react";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
}

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
  href: string;
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, href: "/" }, // Example href
  { name: "Classes", icon: FiTrendingUp, href: "/classes" }, // Example href
  { name: "Services", icon: FiCompass, href: "/services" }, // Example href
  { name: "Messages", icon: AiOutlineMessage, href: "/messages" }, // Example href
  { name: "Actions", icon: AiOutlineSetting, href: "/actions" },
];

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      paddingTop="24"
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Box className="flex justify-end w-full">
        <CloseButton
          display={{ base: "flex", md: "none" }}
          alignSelf="flex-end"
          onClick={onClose}
        />
      </Box>
      {LinkItems.map((link) => (
        <NavItem icon={link.icon} href={link.href} key={link.href}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, href, ...rest }: NavItemProps) => {
  const currentPath = usePathname();

  return (
    <Box style={{ textDecoration: "none" }} className="mb-1">
      <Link href={href}>
        <Flex
          bg={currentPath === href ? "secondary.25" : ""}
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          color={currentPath == href ? "white" : "black"}
          _hover={{
            bg: currentPath == href ? "" : "gray.100",
          }}
          {...rest}
        >
          {icon && <Icon mr="4" fontSize="16" as={icon} />}
          {children}
        </Flex>
      </Link>
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      // ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 8 }}
      pos="fixed"
      zIndex="3"
      w="full"
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Box className="flex gap-1" width={"fit-content"} height={20}>
        <Link href="/">
          <Box display="flex">
            <Image
              src="/ribbon.png"
              alt="Ribbon"
              width={"7"}
              objectFit={"cover"}
            />
            <Image
              src="/binuslogo.png"
              alt="Logo"
              height={"20"}
              padding={"2"}
            />
          </Box>
        </Link>
      </Box>

      <HStack spacing={{ base: "0", md: "6" }}>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  src={
                    "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                  }
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">Justina Clark</Text>
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem>Profile</MenuItem>

              <MenuDivider />
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

interface NavbarProps {
  children: ReactNode;
}

const SidebarWithHeader = ({ children }: NavbarProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <MobileNav onOpen={onOpen} />
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}

      <Box ml={{ base: 0, md: 60 }} p="4" pt="24">
        {children}
      </Box>
    </Box>
  );
};

export default SidebarWithHeader;
