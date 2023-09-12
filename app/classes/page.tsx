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
import { Class, ClassDetail } from "../interfaces/interfaces";
import ClassCard from "../components/cards/classdetailcard";
import { BsFilter } from "react-icons/bs";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { CLASSES_DETAIL_QUERY, queryClassesDetail } from "../utils/constants";
import ClassDetailCard from "../components/cards/classdetailcard";

export default function Classes() {
  const [value, setValue] = useState("");
  const handleChange = (event: React.FormEvent<HTMLInputElement>) =>
    setValue(event.currentTarget.value);

  const [selectedFilter, setSelectedFilter] = useState("all"); // Added selectedFilter state
  const [classesDetail, setClassesDetail] = useState<Array<ClassDetail>>([]);
  const [refresh, setRefresh] = useState(false);
  const toast = useToast();

  const refreshPage = () => {
    setRefresh(!refresh);
  };

  function queryClassDetail() {
    queryClassesDetail()
      .then((result) => {
        setClassesDetail(result);
      })
      .catch((error) => {
        console.error("Error fetching classes courses:", error);
        toast({
          title: "Error",
          description: "An error occurred while fetching classes courses.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  }

  function filterClasses(keyword: string) {
    return classesDetail.filter((classDetail) => {
      const isMatch =
        classDetail.classname.toLowerCase().includes(keyword.toLowerCase()) ||
        classDetail.coursename.toLowerCase().includes(keyword.toLowerCase()) ||
        classDetail.course_id.toLowerCase().includes(keyword.toLowerCase());

      if (selectedFilter === "all") {
        return isMatch;
      } else if (selectedFilter === "linked") {
        return isMatch && classDetail.class_line_group_id !== null;
      } else if (selectedFilter === "unlinked") {
        return isMatch && classDetail.class_line_group_id == null;
      }
    });
  }

  useEffect(() => {
    queryClassDetail();
  }, [refresh]);

  const filteredClasses = filterClasses(value);

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
            {filteredClasses.map((x) => {
              return (
                <ClassDetailCard classDetail={x} refreshPage={refreshPage} />
              );
            })}
          </div>
        </main>
      </Nav>
    </>
  );
}
