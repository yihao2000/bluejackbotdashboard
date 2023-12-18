"use client";
import React, { ChangeEvent, ReactNode, SyntheticEvent, useState } from "react";
import Nav from "@/app/components/navbar";
import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Skeleton,
} from "@chakra-ui/react";
import { AiOutlineSearch } from "react-icons/ai";
import { BsFilter } from "react-icons/bs";
import { MessageTemplate } from "../interfaces/interfaces";
import MessageTemplateCard from "../components/cards/messagetemplatecard";
type Props = {};

const data: Array<MessageTemplate> = [
  {
    name: "hai",
    category: "test",
    data_map: new Map<string, string>([["test", "BB01"]]),
    content: "uga buga",
    id: "123",
  },
  {
    name: "123123",
    category: "123123123",
    data_map: new Map<string, string>([["test", "BB01"]]),
    content: "uga buga",
    id: "4444",
  },
];

type ModalState = {
  title: string,
  content: ReactNode,
  show: boolean,
}

const Page = (props: Props) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<Array<MessageTemplate>>(data);
  const [modal, setModal] = useState<ModalState>({
    title: "",
    content: undefined,
    show: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  };

  const openDetail = (id: string) => {
    
  }

  return (
    <>
      <Nav>
        <main className="max-w-full">
          <Box className="flex gap-3">
            <InputGroup>
              <InputRightElement>
                <AiOutlineSearch />
              </InputRightElement>
              <Input
                value={search}
                onChange={handleChange}
                placeholder="Search..."
                size="md"
              />
            </InputGroup>
            <Select
              width={"36"}
              defaultValue="all"
              icon={<BsFilter />}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">All</option>
              <option value="linked">Global</option>
              <option value="unlinked">Private</option>
            </Select>
          </Box>
          <div className="grid-cols-3 grid gap-7 mt-10">
            {loading || !templates ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Box key={index} maxW="sm">
                  <Skeleton height="100px" width="100%" />
                  <Skeleton height="20px" width="100%" mt="2" />
                  <Skeleton height="20px" width="100%" mt="2" />
                </Box>
              ))
            ) : templates.length !== 0 ? (
              templates.map((x) => {
                return <MessageTemplateCard key={x.id} data={x} openDetail={openDetail}/>;
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
