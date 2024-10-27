"use client";

declare global {
  interface Window {
    nepaliDatePicker: any;
  }
}

import "./form.css";

import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChargesTable from "@/components/chargestable";
import { FaSearch } from "react-icons/fa";
import InputField from "@/components/form-group";
import { StudentSearch } from "@/components/studentSearch";

function EditStudentForm() {
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleEdit = () => {
    setIsFormEditable(true);
    setCharges([]);
    setShowCharges(false);
  };

  const [EditStudent, setEditStudent] = useState<any>(null);
  const [BeforeEditStudent, setBeforeEditStudent] = useState<any>(null);

  const edit = (Student: any) => {
    setBeforeEditStudent(Student);
    setEditStudent(Student);
    setTimeout(() => {
      if (editStudentRef.current) {
        const tablePosition =
          editStudentRef.current.getBoundingClientRect().top + window.scrollY; // Get table's position
        const offset = 100; // Adjust this value to control where the scroll stops (higher = scrolls less)

        window.scrollTo({
          top: tablePosition - offset,
          behavior: "smooth",
        });
      }
    }, 100); // Ensure the table renders first
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditStudent({ ...EditStudent, [name]: value });
  };

  interface Charge {
    id: number;
    type: string;
    amount: number;
    paid: number;
    checked: boolean;
  }

  const [charges, setCharges] = useState<Charge[]>([]);
  const [receivedAmount, setReceivedAmount] = useState(0);

  const handleReceivedAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setReceivedAmount(Number(value));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const chargeData = charges
      .filter((charge) => charge.checked)
      .map((charge) => ({
        description: charge.type,
        charge: charge.amount,
      }));
    try {
      const response = await axios.patch(process.env.NEXT_PUBLIC_EDIT_URL!, {
        studentID: EditStudent.studentID,        
        StudentName: EditStudent.StudentName,
        permanentAddress: EditStudent.permanentAddress,
        localAddress: EditStudent.localAddress,
        mobileNumber: EditStudent.mobileNumber,
        StudentType: EditStudent.StudentType,
        receivedAmount: EditStudent.receivedAmount, // renamed (corrected) field
        gender: EditStudent.gender, // new field
        fatherName: EditStudent.fatherName,
        motherName: EditStudent.motherName, // new field
        grandFatherName: EditStudent.grandFatherName, // new field
        dob: EditStudent.dob, // new field
        editCharges: chargeData,
        busStatus: EditStudent.busStatus,
        scholarship: EditStudent.scholarship,
      });


      console.log("response", response.data);
      if (response.data.success) {
        toast.success("Edited successfully", { theme: "colored" });
        try {
          const receivedAmountData = new FormData();
          receivedAmountData.append(
            "studentID",
            EditStudent.studentID
          );
          receivedAmountData.append(
            "receivedAmount",
            receivedAmount.toString()
          );
          const response = await axios.post(
            process.env.NEXT_PUBLIC_ADMINISTRATIVECHARGEPAYMENT_URL!,
            receivedAmountData
          );
          console.log("response", response.data);
          if (response.data.success) {
            toast.success("Payment Recorded", { theme: "colored" });
            console.log("Payment Recorded");
          } else {
            console.log("Payment failed");
            toast.error("Payment failed", { theme: "colored" });
          }
        } catch (error: any) {
          console.log(error.message);
          toast.error(error.message);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [isFormEditable, setIsFormEditable] = useState(true);
  const [showCharges, setShowCharges] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleContinue = () => {
    setIsFormEditable(false);
    const appliedCharges = [...charges];

    const addChargeIfNotExists = (newCharge: any) => {
      const chargeExists = appliedCharges.some(
        (charge) => charge.id === newCharge.id
      );
      if (!chargeExists) {
        appliedCharges.push(newCharge);
      }
    };

    if (
      EditStudent.studentName !==
      BeforeEditStudent.studentName
    ) {
      addChargeIfNotExists({
        id: 1,
        type: "Naamsari sulka",
        amount: 150,
        paid: 150,
        checked: true,
      });
    }

    if (EditStudent.localAddress !== BeforeEditStudent.localAddress) {
      addChargeIfNotExists({
        id: 2,
        type: "Thausari sulka",
        amount: 1500,
        paid: 1500,
        checked: true,
      });
    }

    

    if (appliedCharges.length > 0) {
      console.log("appliedCharges", appliedCharges);
      setCharges(appliedCharges);
      setShowCharges(true);
    }

    setTimeout(() => {
      if (tableRef.current) {
        const tablePosition =
          tableRef.current.getBoundingClientRect().top + window.scrollY; // Get table's position
        const offset = 100; // Adjust this value to control where the scroll stops (higher = scrolls less)

        window.scrollTo({
          top: tablePosition - offset,
          behavior: "smooth",
        });
      }
    }, 100); // Ensure the table renders first
  };

  const handleCancel = () => { };

  const editStudentRef = useRef<HTMLDivElement>(null);


  return (
    <div>
      <StudentSearch setSearchResults={setSearchResults} />

      <div className="search-results ">
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Address</th>
              <th>Mobile Number</th>
              <th>Student Type</th>
              <th>Father Name</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  <div className="flex flex-col items-center justify-center py-10">
                    {/* Magnifying glass icon */}
                    <FaSearch className="text-gray-500 text-6xl" />

                    {/* No results message */}
                    <h2 className="text-2xl font-bold text-gray-800 mt-5">
                      No results found
                    </h2>

                    <p className="text-gray-500 text-lg mt-2">
                      No results match the filter criteria. Remove filter or
                      clear all filters to show results.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              searchResults.map((result, index) => (
                <tr key={index}>
                  <td>
                    <button
                      onClick={() => edit(result)}
                      className="  px-8 py-2 rounded-md bg-teal-500 text-white font-bold transition duration-200  border-2 border-transparent "
                    >
                      Edit
                    </button>
                  </td>
                  <td>{result.studentID}</td>
                  <td>{result.studentName}</td>
                  <td>{result.permanentAddress}</td>
                  <td>{result.mobileNumber}</td>
                  <td>{result.studentType}</td>
                  <td>{result.fatherName}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {EditStudent && (
        <>
          <div className="form-container" ref={editStudentRef}>
            <h2>Edit Student</h2>
            <form className="registration-form text-custom-light dark:text-custom-dark dark:bg-custom-dark bg-custom-light ">
              <div className="form-section">
                 <h3>Basic Information</h3>
                <InputField labelname="studentID" inputvalue={EditStudent.studentID} handleChange={handleChange} disabled={!isFormEditable} />
                <InputField labelname="studentName" inputvalue={EditStudent.studentName} handleChange={handleChange} disabled={!isFormEditable} />
                <InputField labelname="fatherName" inputvalue={EditStudent.fatherName} handleChange={handleChange} disabled={!isFormEditable} />
                <InputField labelname="motherName" inputvalue={EditStudent.motherName} handleChange={handleChange} disabled={!isFormEditable} />
                

              </div>

              <div className="form-section text-custom-light dark:text-custom-dark">
                <h3>Address Information</h3>
                <InputField labelname="localGuardian" inputvalue={EditStudent.localGuardian} handleChange={handleChange} disabled={!isFormEditable} />
                <InputField labelname="localAddress" inputvalue={EditStudent.localAddress} handleChange={handleChange} disabled={!isFormEditable} />
                <InputField labelname="permanentAddress" inputvalue={EditStudent.permanentAddress} handleChange={handleChange} disabled={!isFormEditable} />
                <InputField labelname="mobileNumber" inputvalue={EditStudent.mobileNumber} handleChange={handleChange} disabled={!isFormEditable} />


              </div>

              <div className="form-section">
                <h3>Academic Information</h3>

                <InputField labelname="section" inputvalue={EditStudent.section} handleChange={handleChange} disabled={!isFormEditable} />
                <InputField labelname="grade" inputvalue={EditStudent.grade} handleChange={handleChange} disabled={!isFormEditable} />
                <div className="form-group">
                  <label htmlFor="studentType">
                   Bus Status <span className="required-dot"></span>
                  </label>
                  <select
                    id="studentType"
                    name="studentType"
                    value={EditStudent.studentType}
                    onChange={handleChange}
                    disabled={!isFormEditable}
                    required
                  >
                    <option value="">Select</option>
                    <option value="None">None</option>
                    <option value="25 percent">25 percent</option>
                    <option value="75 percent">75 percent</option>
                    <option value="Full">Full</option>
                  </select>
                </div>
                <InputField labelname="busStatus" inputvalue={EditStudent.busStatus} handleChange={handleChange} disabled={!isFormEditable} />


              </div>

              <div className="form-section">
                <h3>Additional Information</h3>
                <InputField labelname="dob" inputvalue={EditStudent.dob} handleChange={handleChange} disabled={!isFormEditable} />
                <InputField labelname="gender" inputvalue={EditStudent.gender} handleChange={handleChange} disabled={!isFormEditable} />
                <InputField labelname="grandFatherName" inputvalue={EditStudent.grandFatherName} handleChange={handleChange} disabled={!isFormEditable} />
              </div>
            </form>
          </div>

          <div className="py-4">
            {isFormEditable ? (
              <div className="flex space-x-20 items-center justify-center">
                <button
                  onClick={handleContinue}
                  className="px-12 py-4 rounded-full bg-[#d71e1e]  font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#d71e1ec4] transition-colors duration-200"
                >
                  Clear
                </button>
                <button
                  onClick={handleContinue}
                  className="px-12 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#1ed75fc5] transition-colors duration-200"
                >
                  Continue
                </button>
              </div>
            ) : (
              <>
                <div className="flex space-x-20 items-center justify-center">
                  <button
                    onClick={handleEdit}
                    className="px-12 py-4 rounded-full bg-[#d71e1e]  font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#d71e1ec4] transition-colors duration-200"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-12 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#1ed75fc5] transition-colors duration-200"
                  >
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {showCharges && (
        <div className="pt-7" ref={tableRef}>
          <ChargesTable
            charges={charges}
            setCharges={setCharges}
            formData={EditStudent}
            handleChange={handleChange}
          />
        </div>
      )}

      <ToastContainer theme="colored" closeButton={false} />
    </div>
  );
}

export default EditStudentForm;
