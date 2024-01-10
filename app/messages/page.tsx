"use client";
import React, {
  ChangeEvent,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import Nav from "@/app/components/navbar";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Skeleton,
  useToast,
} from "@chakra-ui/react";
import { AiOutlineSearch } from "react-icons/ai";
import { BsFilter } from "react-icons/bs";
import { MessageTemplate } from "../interfaces/interfaces";
import MessageTemplateCard from "../components/cards/messagetemplatecard";
import MessageDetail from "../components/modal/message/messagedetail";
import CreateMessageTemplate from "../components/modal/message/CreateMessageTemplate";
import { getMessageTemplates } from "../utils/constants";

type Props = {};

const data: Array<MessageTemplate> = [
  {
    name: "hai",
    owner_id: "1",
    category: "test",
    data_map: new Map<string, string>([["test", "BB01"]]),
    raw_content: "uga buga",
    id: "123",
    is_shared: false,
  },
  {
    name: "123123",
    category: "123123123",
    owner_id: "1",
    data_map: new Map<string, string>([["test", "BB01"]]),
    raw_content: "uga buga",
    id: "4444",
    is_shared: false,
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
  const toast = useToast();
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getMessageTemplates();
      const arr: Array<MessageTemplate> = [];
      res.forEach((r: any) => {
        if (r.data_map) {
          const map = new Map(Object.entries(r.data_map));
          arr.push({
            ...r,
            data_map: map,
          });
        } else arr.push(r);
      });
      setTemplates(arr);
      // console.log(res)
    } catch (error) {
      toast({
        title: "Error! Cannot get template data!",
        status: "error",
        isClosable: true,
      });
    }
    setLoading(false);
  };

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
    console.log("open");
    setModal({
      type: "add",
      data: undefined,
      show: true,
    });
  };

  const closeModal = () => {
    setModal({
      type: "none",
      data: undefined,
      show: false,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

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
            <Button onClick={() => openAdd()} colorScheme="twitter">
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
        <CreateMessageTemplate
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
