"use client";
import React, { ChangeEvent, ReactNode, SyntheticEvent, useState } from "react";
import Nav from "@/app/components/navbar";
import {
  Box,
  Button,
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
import MessageDetail from "../components/modal/message/messagedetail";
import AddMessage from "../components/modal/message/addmessage";
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
  type: string;
  data: MessageTemplate | undefined;
  show: boolean;
};

const Page = (props: Props) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<Array<MessageTemplate>>(data);

  const [modal, setModal] = useState<ModalState>({
    type: "detail",
    data: undefined,
    show: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  };

  const openDetail = (id: string) => {
    const data = templates.find((x) => x.id === id);
    setModal({
      type: "detail",
      data: data,
      show: true,
    });
  };

  const openAdd = () => {
    console.log("open")
    setModal({
      type: "add",
      data: undefined,
      show: true,
    })
  }

  const closeModal = () => {
    setModal({
      type: "none",
      data: undefined,
      show: false,
    });
  };

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
          </Box>
          <Box className="py-4 px-0">
            <Button
              className="bg-blue-400 text-white hover:bg-blue-600"
              rounded={"sm"}
              onClick={() => openAdd()}
            >
              Add
            </Button>
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
                return (
                  <MessageTemplateCard
                    key={x.id}
                    data={x}
                    openDetail={openDetail}
                  />
                );
              })
            ) : (
              <p>No message template data available.</p>
            )}
          </div>
        </main>
      </Nav>
      {modal.type === "detail" ? (
        <MessageDetail
          show={modal.show}
          data={modal.data}
          onClose={closeModal}
          toDelete={false}
        />
      ) : modal.type === "add" ? (
        <AddMessage
          isOpen={modal.show}
          onClose={closeModal}
          onFail={() => {}}
          onSuccess={() => {}}
        />
      ) : null}
    </>
  );
};

export default Page;
