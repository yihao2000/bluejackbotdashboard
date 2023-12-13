"use client";
import Image from "next/image";
import Nav from "../components/navbar";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { Class, ClassLineGroup } from "../interfaces/interfaces";
import { BsFilter } from "react-icons/bs";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import {
  queryAssistantClasses,
  queryLinkedAssistantClasses,
} from "../utils/constants";
import ClassDetailCard from "../components/cards/classdetailcard";
import { useSession } from "next-auth/react";
import { useSemester } from "../context/SemesterContext";
import { transformClassApiReponse } from "../utils/formatter";
import { Skeleton } from "@chakra-ui/react";
import { fetchData } from "next-auth/client/_utils";

export default function Classes() {
  const [value, setValue] = useState("");
  const handleChange = (event: React.FormEvent<HTMLInputElement>) =>
    setValue(event.currentTarget.value);

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [classes, setClasses] = useState<Array<Class>>([]);
  const [classLineGroups, setClassLineGroups] = useState<
    ClassLineGroup[] | null
  >(null);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  const toast = useToast();
  const session = useSession();
  const { selectedSemester } = useSemester();

  const refreshPage = () => {
    setRefresh(!refresh);
  };

  function checkClassIdLinked(id: string) {
    const isLinked = !!classLineGroups?.some((clg) => clg.class_id === id);

    return isLinked;
  }

  const fetchData = async () => {
    try {
      // console.log(session.data?.user);
      // console.log(selectedSemester);

      if (session.data?.user.username != null && selectedSemester != null) {
        console.log("Ga null");
        const classesResponse = await queryAssistantClasses(
          session.data?.user.username,
          selectedSemester.semesterID
        );

        if (classesResponse.response != "") {
          const transformedData = transformClassApiReponse(classesResponse);
          setClasses(transformedData);

          if (transformedData.length > 0) {
            const classIds = transformedData.map((c: Class) => c.id);
            const linkedClassesResponse = await queryLinkedAssistantClasses(
              classIds
            );
            setClassLineGroups(linkedClassesResponse);
          }
        } else {
          setClasses([]);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching data.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching classes");
    fetchData();
  }, [refresh, selectedSemester]);

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
                value={value}
                onChange={handleChange}
                placeholder="Search..."
                size="md"
              />
            </InputGroup>
            <Select
              width={"36"}
              defaultValue="all"
              icon={<BsFilter />}
              onChange={(event) => setSelectedFilter(event.target.value)}
            >
              <option value="all">All</option>
              <option value="linked">Linked</option>
              <option value="unlinked">Unlinked</option>
            </Select>
          </Box>
          <div className="grid-cols-3 grid gap-7 mt-10">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Box key={index} maxW="sm">
                  <Skeleton height="100px" width="100%" />
                  <Skeleton height="20px" width="100%" mt="2" />
                  <Skeleton height="20px" width="100%" mt="2" />
                </Box>
              ))
            ) : classes.length !== 0 && classLineGroups !== null ? (
              classes.map((x) => {
                return (
                  <ClassDetailCard
                    isLinked={checkClassIdLinked(x.id)}
                    class={x}
                    refreshPage={refreshPage}
                    key={x.id}
                  />
                );
              })
            ) : (
              <p>No class data available.</p>
            )}
          </div>
        </main>
      </Nav>
    </>
  );
}
