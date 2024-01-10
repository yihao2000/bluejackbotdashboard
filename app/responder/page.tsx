"use client";
import React, { useEffect, useState } from "react";
import { AutoResponse } from "../interfaces/interfaces";
import { getAutoResponses } from "../utils/constants";
import { useToast } from "@chakra-ui/react";

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
import { AiOutlineSearch } from "react-icons/ai";
import { BsFilter } from "react-icons/bs";
import AutoResponseCard from "../components/cards/autoresponsecard";

type Props = {};

const Page = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<Array<AutoResponse>>([]);
  const toast = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAutoResponses();
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Nav>
        <main className="max-w-full">
          <Text fontSize={"2xl"} fontWeight={"semibold"} noOfLines={[1, 3]}>
            Auto Responder
          </Text>
          {/* <Box className="flex gap-3">
          <InputGroup>
            <InputRightElement>
              <AiOutlineSearch />
            </InputRightElement>
            <Input
              backgroundColor={"white"}
              value={search}
              onChange={handleChange}
              placeholder="Search..."
              size="md"
            />
          </InputGroup>
          <Select
            backgroundColor={"white"}
            width={"36"}
            defaultValue="all"
            icon={<BsFilter />}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">All</option>
            <option value="linked">Global</option>
            <option value="unlinked">Private</option>
          </Select>
        </Box> */}
          {/* <Box className="py-4 px-0">
          <Button
            className="bg-blue-400 text-white hover:bg-blue-600"
            rounded={"sm"}
            onClick={() => openAdd()}
          >
            Add
          </Button>
        </Box> */}
          <div className="grid-cols-3 grid gap-7 mt-4">
            {loading || !responses ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Box key={index} maxW="sm">
                  <Skeleton height="100px" width="100%" />
                  <Skeleton height="20px" width="100%" mt="2" />
                  <Skeleton height="20px" width="100%" mt="2" />
                </Box>
              ))
            ) : responses.length !== 0 ? (
              responses.map((x) => {
                return (
                  <AutoResponseCard
                    key={x.id}
                    data={x}
                    //   openDetail={openDetail}
                  />
                );
              })
            ) : (
              <p>No message template data available.</p>
            )}
          </div>
        </main>
      </Nav>
    </>
  );
};

export default Page;
