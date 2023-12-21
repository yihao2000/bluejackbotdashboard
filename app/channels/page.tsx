"use client";
import {
  Box,
  Text,
  Button,
  HStack,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import Nav from "../components/navbar";
import { GoBroadcast } from "react-icons/go";
import { useEffect, useState } from "react";
import { Channel } from "../interfaces/interfaces";
import { queryChannels } from "../utils/constants";
import { CreateChannelModal } from "../components/modal/createchannelmodal";
import ChannelDetailCard from "../components/cards/channeldetailcard";
import { transformChannelData } from "../utils/formatter";

export default function Channels() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const addChannelModalDisclosure = useDisclosure();

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    queryChannels().then((res) => {
      setChannels(transformChannelData(res));
    });
  }, [refresh]);

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
            <Box className="grid-cols-3 grid gap-7 mt-10">
              {channels.map((x) => {
                return (
                  <ChannelDetailCard
                    channel={x}
                    refreshPage={refreshPage}
                    refresh={refresh}
                  />
                );
              })}
            </Box>
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
