"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./form.css"; // Ensure to import the CSS file
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterFees: React.FC = () => {
  const [className, setClassName] = useState<string>("");
  const [semester, setSemester] = useState<string>("");
  const [stream, setStream] = useState<string>("");
  const [fees, setFees] = useState<{
    [key: string]: string;
  }>({
    "Admission": "",
    "Tuition": "",
    "Library": "",
    "ComputerLab": "",
    "Sports": "",
    "Examination": "",
    "Stationery": "",
    "Transportation": "",
    "Miscellaneous": "",
  });
  const [message, setMessage] = useState<string>("");

    // Reset form to initial state
    const resetForm = () => {
      setClassName("");
      setSemester("");
      setStream("");
      setFees({
        "Admission": "",
        "Tuition": "",
        "Library": "",
        "ComputerLab": "",
        "Sports": "",
        "Examination": "",
        "Stationery": "",
        "Transportation": "",
        "Miscellaneous": "",
      });
    };
  
    const [classRecord, setClassRecord] = useState<any>(null);

  // Handle changes in the fee inputs
  const handleFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFees({ ...fees, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const parsedFees = Object.fromEntries(
      Object.entries(fees).map(([key, value]) => [key, parseInt(value) || 0]) // parse as int, defaulting to 0 if NaN
    );
    const formData = {
      className,
      semester,
      stream,
      fees : parsedFees,
    };

    try {
      let response;
      if (classRecord) {
        // If fees already exist, update them
        response = await axios.put(process.env.NEXT_PUBLIC_UPDATEFEES_URL!, formData);
      } else {
        // If no fees exist, create new ones
        response = await axios.post(process.env.NEXT_PUBLIC_REGISTERFEES_URL!, formData);
      }
      console.log("response", response.data);
      if (response.data.success) {
        toast.success("Payment Recorded", { theme: "colored" });
        console.log("Payment Recorded");
      } else {
        console.log("Payment failed");
        toast.error("Payment failed", { theme: "colored" });
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || "An error occurred while fetching fees.");
      console.error(error);
    }
    resetForm();
  };



    // Fetch fee data when class, semester, or stream is selected
    useEffect(() => {
      if (className) {
        fetchFeeData();
      }
    }, [className, semester, stream]);
  
    // Function to fetch fee data
    const fetchFeeData = async () => {
      console.log("Fetching fees");
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_GETFEES_URL!, {
          params: { className, semester, stream },
        });
        if (response.data.success) {
          setFees(response.data.fees); // Update fees with fetched data
          setClassRecord(response.data.fees); // Display fetched data in table
        } else {
          setMessage("No fee data found for selected class.");
        }
      } catch (error: any) {
        setMessage(error.response?.data?.message || "An error occurred while fetching fees.");
        console.error(error);
      }
    };


  return (
    <div>
      <div className="form-container dark:bg-custom-dark bg-custom-light">
        <div className="relative z-9 search-form-adj text-custom-light dark:text-custom-dark dark:bg-custom-dark bg-custom-light">
          <h2 className="absolute z-10">Set Fees</h2>
            <div className="flex space-x-20 ">
              <div className="form-group">
                <label>Class</label>
                <select
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Class
                  </option>
                  <option value="PG">PG</option>
                  <option value="Nursery">Nursery</option>
                  <option value="LKG">LKG</option>
                  <option value="UKG">UKG</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={`Class ${i + 1}`}>
                      Class {i + 1}
                    </option>
                  ))}
                  <option value="Diploma">Diploma</option>
                </select>
              </div>
              {/* Conditional Semester and Stream for Diploma */}
              {className === "Diploma" && (
                <div className="flex space-x-20 ">
                  <div className="form-group">
                    <label>Semester</label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select Semester
                      </option>
                      {[1, 2, 3, 4, 5, 6].map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Stream</label>
                    <select
                      value={stream}
                      onChange={(e) => setStream(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select Stream
                      </option>
                      <option value="Computer Engineering">
                        Diploma in Computer Engineering
                      </option>
                      <option value="Isc Ag">Isc Ag</option>
                      <option value="Vet ISc Ag">Vet ISc Ag</option>
                      <option value="Agriculture">
                        Diploma in Agriculture
                      </option>
                      <option value="Health Assistant">Health Assistant</option>
                      <option value="Lab Technician">Lab Technician</option>
                      <option value="Staff Nurse">Staff Nurse</option>
                      <option value="Civil Engineering">
                        Diploma in Civil Engineering
                      </option>
                    </select>
                  </div>
                </div>
              )}
            </div>



        </div>

        
      </div>

      <div className="search-results !mt-0 ">
        <table>
          <thead>
            <tr>
              <th>Admission </th>
              <th>Tuition </th>
              <th>Library </th>
              <th className="!w-[20%]">Computer Lab </th>
              <th>Sports </th>
              <th>Examination </th>
              <th>Stationery </th>
              <th>Transportation </th>
              <th>Misc. </th>
            </tr>
          </thead>
          <tbody>
            {classRecord ? (
              <tr>
                <td>{classRecord.Admission || "N/A"}</td>
                <td>{classRecord.Tuition || "N/A"}</td>
                <td>{classRecord.Library || "N/A"}</td>
                <td>{classRecord.ComputerLab || "N/A"}</td>
                <td>{classRecord.Sports || "N/A"}</td>
                <td>{classRecord.Examination || "N/A"}</td>
                <td>{classRecord.Stationery || "N/A"}</td>
                <td>{classRecord.Transportation || "N/A"}</td>
                <td>{classRecord.Misc || "N/A"}</td>
              </tr>
            ) : (
              <tr>
                <td
                  colSpan={9}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  <div className="text-xl text-red-500 ">
                    
                    {message && <div>{message}</div> || <div >Please select class to view record !!!</div>}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="form-container !pt-0 dark:bg-custom-dark bg-custom-light">
        <div className="search-form-adj !mt-0 text-custom-light dark:text-custom-dark dark:bg-custom-dark bg-custom-light">
          <div className="grid grid-cols-4 ">
            {Object.keys(fees).map((feeType) => (
              <div className="form-group" key={feeType}>
                <label htmlFor={feeType}>{feeType}</label>
                <input
                  type="number"
                  id={feeType}
                  name={feeType}
                  placeholder={`Enter ${feeType}`}
                  value={fees[feeType]}
                  onChange={handleFeeChange}
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="ml-[450px] px-12 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#1ed75fc5] transition-colors duration-200"
          >
            {classRecord ? "Update Fees" : "Set Fees"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterFees;
