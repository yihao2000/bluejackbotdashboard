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
} from "@chakra-ui/react";
import { Class, ClassDetail } from "../interfaces/interfaces";
import ClassCard from "../components/classdetailcard";
import { BsFilter } from "react-icons/bs";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { CLASSES_DETAIL_QUERY } from "../utils/constants";
import ClassDetailCard from "../components/classdetailcard";

export default function Classes() {
  const [value, setValue] = useState("");
  const handleChange = (event: React.FormEvent<HTMLInputElement>) =>
    setValue(event.currentTarget.value);

  const [classesDetail, setClassesDetail] = useState<Array<ClassDetail>>([]);
  const [refresh, setRefresh] = useState(false);

  const refreshPage = () => {
    setRefresh(!refresh);
  };

  function queryClasses() {
    fetch(CLASSES_DETAIL_QUERY)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setClassesDetail(result); // Update the state with the fetched data
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  useEffect(() => {
    queryClasses();
  }, [refresh]);

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
            <Select width={"36"} defaultValue="all" icon={<BsFilter />}>
              <option value="all">All</option>
              <option value="linked">Linked</option>
              <option value="unlinked">Unlinked</option>
            </Select>
          </Box>
          <div className="grid-cols-3 grid gap-7 mt-10">
            {classesDetail.map((x) => {
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
