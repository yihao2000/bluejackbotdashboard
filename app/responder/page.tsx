"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { AutoResponse } from "../interfaces/interfaces";
import { getAutoResponses } from "../utils/constants";
import { HStack, Icon, useToast } from "@chakra-ui/react";

import Nav from "@/app/components/navbar";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { AiFillMessage, AiOutlineMessage, AiOutlineSearch } from "react-icons/ai";
import { BsFilter } from "react-icons/bs";
import AutoResponseCard from "../components/cards/autoresponsecard";
import CreateAutoRespond from "../components/modal/createautorespond";
import { useSession } from "next-auth/react";

type Props = {};

type ModalState = {
  type: string;
  data: AutoResponse | undefined;
  show: boolean;
};

const Page = (props: Props) => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<Array<AutoResponse>>([]);
  const [filteredResponses, setFilteredResponses] = useState<Array<AutoResponse>>([]);
  const toast = useToast();

  const { data } = useSession();

  const [refresh, setRefresh] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  };

  const applyFilter = () => {
    let filtered = responses;

    if (search) {
      filtered = filtered.filter(response =>
        response.name.toLowerCase().includes(search.toLowerCase()) ||
        response.response_message.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredResponses(filtered);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAutoResponses(data?.user.id || '');
      console.log(data?.user.id)
      const arr: Array<AutoResponse> = [];
      res.forEach((r: any) => {
        const words = r.trigger_words?.split(",");
        arr.push({
          ...r,
          trigger_words: words,
        });
      });
      setResponses([...arr]);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error! Cannot get auto response data!",
        status: "error",
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const [modal, setModal] = useState<ModalState>()

  const openAdd = () => {
    console.log("open");
    setModal({
      type: "add",
      data: undefined,
      show: true,
    });
  };

  const refreshPage = () => {
    console.log("Refreshing");
    setRefresh(!refresh);
  };

  useEffect(() => {
    fetchData();
  }, [refresh, data]);

  useEffect(() => {
    applyFilter();
  }, [responses, search]);

  return (
    <>
      <Nav>
        <main className="max-w-full">
        <Box display="flex" justifyContent="space-between">
            <HStack>
              <Icon fontSize="4xl" as={AiOutlineMessage} mr={4} />
              <Text fontSize="3xl" fontWeight="bold">
                Auto Responses
              </Text>
            </HStack>

            <Button onClick={() => openAdd()} colorScheme="twitter">
              Create New Auto Response
            </Button>
          </Box>
          <Box className="flex gap-3 mt-6">
          <InputGroup>
            <InputRightElement>
              <AiOutlineSearch />
            </InputRightElement>
            <Input
              backgroundColor={"white"}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Search..."
              size="md"
            />
          </InputGroup>
        </Box>
        <Box className="py-2 px-0"></Box>
          <div className="grid-cols-3 grid gap-7 mt-4">
            {loading || !filteredResponses ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Box key={index} maxW="sm">
                  <Skeleton height="100px" width="100%" />
                  <Skeleton height="20px" width="100%" mt="2" />
                  <Skeleton height="20px" width="100%" mt="2" />
                </Box>
              ))
            ) : filteredResponses.length !== 0 ? (
              filteredResponses.map((x) => {
                return (
                  <AutoResponseCard
                    key={x.id}
                    refreshPage={refreshPage}
                    data={x}
                    openDetail={() => {}}
                  />
                );
              })
            ) : (
              <p>No auto responses data available.</p>
            )}
          </div>
        </main>
      </Nav>
      {modal?.type === "add" ? (
        <CreateAutoRespond
          isOpen={modal?.show}
          onClose={() => {setModal(undefined)}}
        />
      ) : null}
    </>
  );
};

export default Page;
