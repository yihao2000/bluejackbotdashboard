"use client";
import {
  Box,
  Text,
  Button,
  HStack,
  Icon,
  useDisclosure,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Skeleton,
} from "@chakra-ui/react";
import Nav from "../components/navbar";
import { GoBroadcast } from "react-icons/go";
import { ChangeEvent, useEffect, useState } from "react";
import { Channel } from "../interfaces/interfaces";
import { queryChannels } from "../utils/constants";
import { CreateChannelModal } from "../components/modal/createchannelmodal";
import ChannelDetailCard from "../components/cards/channeldetailcard";
import { transformChannelData } from "../utils/formatter";
import { AiOutlineSearch } from "react-icons/ai";
import { BsFilter } from "react-icons/bs";

export default function Channels() {
  const [search, setSearch] = useState("");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [filteredChannels, setFilteredChannels] = useState<Channel[]>([]);
  const addChannelModalDisclosure = useDisclosure();

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    queryChannels().then((res) => {
      setChannels(transformChannelData(res));
    });
  }, [refresh]);

  useEffect(() => {
    applyFilter();
  }, [channels, search]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  };

  const applyFilter = () => {
    let filtered = channels;

    if (search) {
      filtered = filtered.filter(channel =>
        channel.channel_name.toLowerCase().includes(search.toLowerCase()) ||
        channel.channel_description.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredChannels(filtered);
  };

  const refreshPage = () => {
    console.log("Refreshing");
    setRefresh(!refresh);
  };

  const openAddChanelModal = () => {
    addChannelModalDisclosure.onOpen();
  };
  const handleCreateChannelClick = () => {
    openAddChanelModal();
  };

  return (
    <>
      <Nav>
        <main className="max-w-full">
          <Box>
            <Box display="flex" justifyContent="space-between">
              <HStack>
                <Icon fontSize="4xl" as={GoBroadcast} mr={4} />
                <Text fontSize="3xl" fontWeight="bold">
                  Channels
                </Text>
              </HStack>

              <Button
                colorScheme="twitter"
                onClick={() => {
                  handleCreateChannelClick();
                }}
              >
                Create new Channel
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
            </Box>
              <div className="grid-cols-3 grid gap-7 mt-8">
                {loading || !filteredChannels ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <Box key={index} maxW="sm">
                      <Skeleton height="100px" width="100%" />
                      <Skeleton height="20px" width="100%" mt="2" />
                      <Skeleton height="20px" width="100%" mt="2" />
                    </Box>
                  ))
                ) : filteredChannels.length !== 0 ? (
                  filteredChannels.map((channel) => {
                    return (
                      <ChannelDetailCard
                        key={channel.channel_id}
                        channel={channel}
                        refreshPage={refreshPage}
                        refresh={refresh}
                      />
                    );
                  })
                ) : (
                  <p>No channel data available.</p>
                )}
              </div>
          </Box>
        </main>
      </Nav>

      <CreateChannelModal
        refreshPage={refreshPage}
        {...addChannelModalDisclosure}
      />
    </>
  );
}
