"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useRef,
} from "react";
import "./form.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import ChargesTable from "@/components/chargestable";

interface RegCharge {
  description: string;
  charge: number;
}

interface FormData {
  student_id: string;
  registration_date: string;

  student_name: string;
  class_name: string;
  stream: string;
  semester: string;
  local_address: string;
  permanent_address: string;
  mobile_number: string;
  bus_status: string;
  student_type: string;
  local_guardian: string;
  received_amount: string;
  registration_charges: RegCharge[];
  gender: string;
  mother_name: string;
  father_name: string;

  dob: string;
}

function StudentRegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    student_id: "",
    registration_date: "",

    student_name: "",
    class_name: "",
    stream: "",
    semester: "",
    local_address: "",
    permanent_address: "",

    mobile_number: "",
    bus_status: "",
    student_type: "",
    local_guardian: "",

    received_amount: "",
    registration_charges: [],
    gender: "",
    mother_name: "",
    father_name: "",

    dob: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [charges, setCharges] = useState<Charge[]>([]);

  const fetchCharges = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_LOADCHARGES_URL!,
        {
          params: {
            className: formData.class_name,
            semester: formData.semester,
            stream: formData.stream,
          },
        }
      );
      // Map the API response to match the Charge structure
      const chargesData = Object.entries(response.data).map(
        ([type, amount], index) => ({
          id: index + 1,
          type: type.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase()), // Format type string
          amount: Number(amount) || 0,
          paid: Number(amount) || 0,
          checked: true,
        })
      );
      console.log("response", response.data);
      setCharges(chargesData);
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const handleRegistration = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      charges
        .filter((charge) => charge.checked)
        .forEach((charge) => {
          // Check if the charge already exists in the array
          if (
            !formData.registration_charges.some(
              (existingCharge) => existingCharge.description === charge.type
            )
          ) {
            formData.registration_charges.push({
              description: charge.type,
              charge: charge.amount,
            });
          }
        });

      const response = await axios.post(
        process.env.NEXT_PUBLIC_REGISTER_URL!,
        formData
      );
      console.log("response", response.data);
      if (response.data.success) {
        toast.success("Registration successful", { theme: "colored" });
        console.log("Registration successful");
        try {
          const response = await axios.post(
            process.env.NEXT_PUBLIC_ADMINISTRATIVECHARGEPAYMENT_URL!,
            formData
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
      } else {
        console.log("Registration failed");
        toast.error("Registration failed", { theme: "colored" });
      }
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  interface Charge {
    id: number;
    type: string;
    amount: number;
    paid: number;
    checked: boolean;
  }

  const [isFormEditable, setIsFormEditable] = useState(true);
  const [showCharges, setShowCharges] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleContinue = () => {
    console.log(formData);
    setIsFormEditable(false);
    fetchCharges();
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
    setShowCharges(true);
  };

  const handleEdit = () => {
    setIsFormEditable(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Handle form submission logic
  };

  const handleCancel = () => {
    // Handle cancel logic, maybe reset the form or navigate away
  };

  return (
    <div className=" form-container dark:bg-custom-dark bg-custom-light">
      <h2 className="text-custom-light dark:text-custom-dark">
        Student Registration
      </h2>
      <form
        onSubmit={handleSubmit}
        className="registration-form text-custom-light dark:text-custom-dark dark:bg-custom-dark bg-custom-light "
      >
        <div className="form-section">
          <h3>Basic Information</h3>

          <div className="form-group">
            <label htmlFor="student_id">
              Student ID <span className="required-dot"></span>
            </label>
            <input
              type="text"
              id="student_id"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              disabled={!isFormEditable}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="student_name">
              Students Name
              <span className="required-dot"></span>
            </label>
            <input
              type="text"
              id="student_name"
              name="student_name"
              value={formData.student_name}
              onChange={handleChange}
              disabled={!isFormEditable}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">
              Gender <span className="required-dot"></span>{" "}
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={!isFormEditable}
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="father_name">Father Name </label>
            <input
              type="text"
              id="father_name"
              name="father_name"
              value={formData.father_name}
              onChange={handleChange}
              disabled={!isFormEditable}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="mother_name">Mother Name </label>
            <input
              type="text"
              id="mother_name"
              name="mother_name"
              value={formData.mother_name}
              onChange={handleChange}
              disabled={!isFormEditable}
              required
            />
          </div>
        </div>

        <div className="form-section text-custom-light dark:text-custom-dark">
          <h3>Address Information</h3>

          <div className="form-group text-custom-light dark:text-custom-dark  ">
            <label htmlFor="addressEnglish">
              Permanent Address <span className="required-dot"></span>{" "}
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.permanent_address}
              onChange={handleChange}
              disabled={!isFormEditable}
              required
            />
          </div>

          <div className="form-group text-custom-light dark:text-custom-dark  ">
            <label htmlFor="address">
              Local Address <span className="required-dot"></span>{" "}
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.local_address}
              onChange={handleChange}
              disabled={!isFormEditable}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobile_number">Mobile Number </label>
            <input
              type="text"
              id="mobile_number"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              disabled={!isFormEditable}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="father_name">Local Guardian</label>
            <input
              type="text"
              id="father_name"
              name="father_name"
              value={formData.father_name}
              onChange={handleChange}
              disabled={!isFormEditable}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Bus Information</h3>

          <div className="form-group">
            <label htmlFor="bus_status">
              Bus Status <span className="required-dot"></span>
            </label>
            <select
              id="bus_status"
              name="bus_status"
              value={formData.bus_status}
              onChange={handleChange}
              disabled={!isFormEditable}
              required
            >
              <option value="">Select</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="StudentType">
              Route <span className="required-dot"></span>{" "}
            </label>
            <select
              id="student_type"
              name="student_type"
              value={formData.student_type}
              onChange={handleChange}
              disabled={!isFormEditable}
              required
            >
              <option value="">Select</option>
              <option value="Private">Private</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Udhyog">Udhyog</option>
              <option value="School">School</option>
              <option value="Temple">Temple</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Information</h3>

          <div className="form-group">
            <label htmlFor="registration_date">
              Registration Date <span className="required-dot"></span>{" "}
            </label>
            <input
              type="text"
              id="nepali-datepicker-2"
              name="registration_date"
              disabled={!isFormEditable}
              required
            />
          </div>

          <div className="form-group">
            <label>Class</label>
            <select
              name="class_name"
              value={formData.class_name}
              onChange={handleChange}
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
          {formData.class_name === "Diploma" && (
            <div>
              <div className="form-group">
                <label>Semester</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
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
                  name="stream"
                  value={formData.stream}
                  onChange={handleChange}
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
                  <option value="Agriculture">Diploma in Agriculture</option>
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

          <div className="form-group">
            <label htmlFor="section">
              Scholarship<span className="required-dot"></span>{" "}
            </label>
            <select
              id="student_type"
              name="student_type"
              value={formData.student_type}
              onChange={handleChange}
              disabled={!isFormEditable}
              required
            >
              <option value="">Select</option>
              <option value="Private">Private</option>
              <option value="Temple">Temple</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="text"
              id="nepali-datepicker-5"
              name="dob"
              disabled={!isFormEditable}
              required
            />
          </div>
        </div>
      </form>

      {showCharges && (
        <div className="pt-7" ref={tableRef}>
          <ChargesTable
            charges={charges}
            setCharges={setCharges}
            formData={formData}
            handleChange={handleChange}
          />
        </div>
      )}

      <div className="py-4">
        {isFormEditable ? (
          <div className="flex space-x-20">
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
            <div className="flex space-x-20">
              <button
                onClick={handleEdit}
                className="px-12 py-4 rounded-full bg-[#d71e1e]  font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#d71e1ec4] transition-colors duration-200"
              >
                Previous
              </button>
              <button
                onClick={handleRegistration}
                className="px-12 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#1ed75fc5] transition-colors duration-200"
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>
      <ToastContainer theme="colored" closeButton={false} />
    </div>
  );
}

export default StudentRegistrationForm;
