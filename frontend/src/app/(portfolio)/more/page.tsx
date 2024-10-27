// DashboardPage.js
'use client';
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const DashboardPage = () => {
  // State for form data
  const [studentName, setStudentName] = useState("");
  const [className, setClassName] = useState("");
  const [localAddress, setLocalAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [Landline, setLandline] = useState("");
  const [phoneno , setPhoneno] = useState("");
  interface StudentEntry {
    studentName: string;
    className: string;
    localAddress: string;
    permanentAddress: string;
    fatherName: string;
    motherName: string;
    Landline: string;
    phoneno: string;
  }
  
  const [recentEntries, setRecentEntries] = useState<StudentEntry[]>([]);

  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (studentName && className && localAddress && permanentAddress && fatherName && motherName && Landline && phoneno) {
      const newEntry = {
        studentName,
        className,
        localAddress,
        permanentAddress,
        fatherName,
        motherName,
        Landline,
        phoneno,
      };

      const updatedEntries = [newEntry, ...recentEntries.slice(0, 9)]; // Keep only the last 10 entries

      // Save to state and localStorage
      setRecentEntries(updatedEntries);
     

      // Reset form fields
      setStudentName("");
      setClassName("");
      setLocalAddress("");
      setPermanentAddress("");
      setFatherName("");
      setMotherName("");
      setLandline("");
      setPhoneno("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-800 to-purple-900 text-white">
      <motion.div
        className="container mx-auto px-6 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        {/* Dashboard Header */}
        <motion.h1
          className="text-4xl font-bold text-center mb-8"
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 50 }}
        >
          School Dashboard
        </motion.h1>

        {/* Form Section */}
        <motion.div
          className="bg-purple-700 p-8 rounded-lg shadow-md max-w-md mx-auto"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Add New Student</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium">Student Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-purple-600 bg-purple-800 rounded-md focus:ring-2 focus:ring-purple-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Class</label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-purple-600 bg-purple-800 rounded-md focus:ring-2 focus:ring-purple-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Local Address</label>
              <input
                type="text"
                value={localAddress}
                onChange={(e) => setLocalAddress(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-purple-600 bg-purple-800 rounded-md focus:ring-2 focus:ring-purple-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Permanent Address</label>
              <input
                type="text"
                value={permanentAddress}
                onChange={(e) => setPermanentAddress(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-purple-600 bg-purple-800 rounded-md focus:ring-2 focus:ring-purple-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Father's Name</label>
              <input
                type="text"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-purple-600 bg-purple-800 rounded-md focus:ring-2 focus:ring-purple-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Mother's Name</label>
              <input
                type="text"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-purple-600 bg-purple-800 rounded-md focus:ring-2 focus:ring-purple-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Contact Info</label>
              <input
                type="text"
                value={Landline}
                onChange={(e) => setLandline(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-purple-600 bg-purple-800 rounded-md focus:ring-2 focus:ring-purple-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Alternative no</label>
              <input
                type="text"
                value={phoneno}
                onChange={(e) => setPhoneno(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-purple-600 bg-purple-800 rounded-md focus:ring-2 focus:ring-purple-300"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-500 py-2 rounded-md text-white font-semibold hover:bg-purple-400"
            >
              Submit
            </button>
          </form>
        </motion.div>

        {/* Recent Entries Section */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center mb-4">
            Recent Submissions
          </h2>
          <ul className="space-y-4">
            {recentEntries.length === 0 ? (
              <p className="text-center text-gray-400">No entries yet.</p>
            ) : (
              recentEntries.map((entry, index) => (
                <li
                  key={index}
                  className="bg-purple-700 p-4 rounded-lg shadow-md"
                >
                  <p className="font-semibold">Student: {entry.studentName}</p>
                  <p>Class: {entry.className}</p>
                  <p>Local Address: {entry.localAddress}</p>
                  <p>Permanent Address: {entry.permanentAddress}</p>
                  <p>Father's Name: {entry.fatherName}</p>
                  <p>Mother's Name: {entry.motherName}</p>
                  <p>Contact Info: {entry.Landline}</p>
                  <p>Alternative no: {entry.phoneno}</p>
                </li>
              ))
            )}
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
