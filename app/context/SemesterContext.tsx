import {
  createContext,
  ReactNode,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { Semester } from "../interfaces/interfaces";
import { queryActiveSemester, queryAllSemesters } from "../utils/constants";
import { transformSemesterApiResponse } from "../utils/formatter";
import { Box, Spinner } from "@chakra-ui/react";

interface SemesterContextType {
  semesters: Semester[] | undefined;
  setSemesters: Dispatch<SetStateAction<Semester[] | undefined>>;
  selectedSemester: Semester | null;
  setSelectedSemester: Dispatch<SetStateAction<Semester | null>>;
  loading: boolean;
}

const SemesterContext = createContext<SemesterContextType | undefined>(
  undefined
);

export function useSemester() {
  const context = useContext(SemesterContext);
  if (!context) {
    throw new Error("useSemester must be used within a SemesterProvider");
  }
  return context;
}

export function SemesterProvider({ children }: { children: ReactNode }) {
  const [semesters, setSemesters] = useState<Semester[] | undefined>([]); // Initialize with an empty array
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(
    null
  );
  const [loading, setLoading] = useState(true); // Initialize loading state as true

  useEffect(() => {
    Promise.all([queryActiveSemester(), queryAllSemesters()])
      .then(([activeSemesterResponse, allSemestersResponse]) => {
        const activeSemester: Semester = {
          semesterID: activeSemesterResponse.response["a:SemesterId"],
          description: activeSemesterResponse.response["a:description"],
        };
        setSelectedSemester(activeSemester);

        const transformedData = transformSemesterApiResponse(
          allSemestersResponse.response
        );
        setSemesters(transformedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        setLoading(false);
      });
  }, []);

  return loading ? (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100%"
      backgroundColor="rgba(0, 0, 0, 0.1)"
      zIndex="9999"
    >
      <Spinner size="xl" color="white" />
    </Box>
  ) : (
    <SemesterContext.Provider
      value={{
        semesters,
        setSemesters,
        selectedSemester,
        setSelectedSemester,
        loading,
      }}
    >
      {children}
    </SemesterContext.Provider>
  );
}
