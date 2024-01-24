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
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Skeleton,
  Text,
  useToast,
} from "@chakra-ui/react";
import { AiOutlineSearch } from "react-icons/ai";
import { BsFilter } from "react-icons/bs";
import { MessageTemplate } from "../interfaces/interfaces";
import MessageTemplateCard from "../components/cards/messagetemplatecard";
import MessageDetail from "../components/modal/message/messagedetail";
import CreateMessageTemplate from "../components/modal/message/CreateMessageTemplate";
import { getMessageTemplates } from "../utils/constants";
import { AiOutlineMessage, AiOutlineSetting } from "react-icons/ai";

type Props = {};

const data: Array<MessageTemplate> = [
  {
    name: "hai",
    owner_id: "1",
    category: "test",
    data_map: new Map<string, string>([["test", "BB01"]]),
    raw_content: "uga buga",
    id: "123",
    is_shared: 1,
  },
  {
    name: "123123",
    category: "123123123",
    owner_id: "1",
    data_map: new Map<string, string>([["test", "BB01"]]),
    raw_content: "uga buga",
    id: "4444",
    is_shared: 0,
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
  const [filteredTemplates, setFilteredTemplates] = useState<Array<MessageTemplate>>([]);
  const toast = useToast();

  const [refresh, setRefresh] = useState(false);

  const applyFilter = () => {
    let filtered = templates;

    switch (filter) {
      case 'linked':
        filtered = filtered.filter(template => template.is_shared === 1);
        break;
      case 'unlinked':
        filtered = filtered.filter(template => template.is_shared === 0);
        break;
      default:
        break;
    }

    if (search) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(search.toLowerCase()) ||
        template.raw_content.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredTemplates(filtered);
  };
  
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

  const refreshPage = () => {
    console.log("Refreshing");
    setRefresh(!refresh);
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  useEffect(() => {
    applyFilter();
  }, [templates, filter, search]);

  return (
    <>
      <Nav>
        <main className="max-w-full">
          <Box display="flex" justifyContent="space-between">
            <HStack>
              <Icon fontSize="4xl" as={AiOutlineMessage} mr={4} />
              <Text fontSize="3xl" fontWeight="bold">
                Message Templates
              </Text>
            </HStack>

            <Button onClick={() => openAdd()} colorScheme="twitter">
              Create New Message Template
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
          <Box className="py-4 px-0"></Box>
          <div className="grid-cols-3 grid gap-7">
            {loading || !filteredTemplates ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Box key={index} maxW="sm">
                  <Skeleton height="100px" width="100%" />
                  <Skeleton height="20px" width="100%" mt="2" />
                  <Skeleton height="20px" width="100%" mt="2" />
                </Box>
              ))
            ) : filteredTemplates.length !== 0 ? (
              filteredTemplates.map((x) => {
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
