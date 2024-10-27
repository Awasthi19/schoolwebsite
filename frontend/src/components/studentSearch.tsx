import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

interface StudentSearchProps {
  setSearchResults: (results: any[]) => void;
}

export function StudentSearch({ setSearchResults }: StudentSearchProps) {
  const placeholder1 = ["Search by Student Name"];
  const placeholder2 = ["Search by Student ID"];

  const [StudentNameQuery, setStudentNameQuery] = useState("");
  const [StudentIDQuery, setStudentIDQuery] = useState("");

  // Function to fetch search suggestions
  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_SEARCH_URL!, {
        params: {
          studentIDQuery: StudentIDQuery,
          studentNameQuery: StudentNameQuery,
        },
      });
      console.log("response", response.data);
      setSearchResults(response.data); // Update parent component's state
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Debounced version of the fetchSuggestions function
  const debouncedFetchSuggestions = useCallback(
    debounce(() => {
      if (StudentNameQuery || StudentIDQuery) {
        fetchSuggestions();
      }
    }, 300),
    [StudentNameQuery, StudentIDQuery]
  );

  // Trigger debounced function when the inputs change
  useEffect(() => {
    debouncedFetchSuggestions();
    return () => {
      debouncedFetchSuggestions.cancel(); // Cleanup debounce on unmount
    };
  }, [StudentNameQuery, StudentIDQuery, debouncedFetchSuggestions]);

  const handleSearch = async (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchSuggestions();
  };

  return (
    <div className="form-container dark:bg-custom-dark bg-custom-light">
      <div className="relative z-9 search-form text-custom-light dark:text-custom-dark dark:bg-custom-dark bg-custom-light">
        <h2 className="absolute z-10">Search Student</h2>
        <div className="search-form-group">
          <label htmlFor="StudentNameQuery">Student Name</label>
          <PlaceholdersAndVanishInput
            placeholders={placeholder1}
            onChange={(e) => setStudentNameQuery(e.target.value)}
            onSubmit={handleSearch}
          />
        </div>
        <div className="search-form-group">
          <label htmlFor="StudentID">Student ID</label>
          <PlaceholdersAndVanishInput
            placeholders={placeholder2}
            onChange={(e) => setStudentIDQuery(e.target.value)}
            onSubmit={handleSearch}
          />
        </div>
      </div>
    </div>
  );
}
