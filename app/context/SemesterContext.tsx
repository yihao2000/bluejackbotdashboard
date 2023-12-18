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
    <div>Loading...</div>
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
