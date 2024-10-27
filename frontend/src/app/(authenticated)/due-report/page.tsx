"use client";

import React from "react";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./form.css";
import axios from "axios";

function DueReport() {
  const [dueReportDetails, setDueReportDetails] = useState<any[]>([]);
  const [totalDueSum, setTotalDueSum] = useState<number>(0);

  const LoadDueReport = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_DUEREPORT_URL!
      );
      console.log("response", JSON.stringify(response.data));
      const feesData = response.data.fees_data;
      setDueReportDetails(feesData);

      // Calculate total sum of 'total_due'
      const totalSum = feesData.reduce(
        (acc: number, curr: any) => acc + (curr.total_due || 0),
        0
      );
      setTotalDueSum(totalSum);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    LoadDueReport();
  }, []);

  return (
    <div>
      <div className="relative search-results !mt-[120px]">
        <table>
          <thead>
            <tr>
              <th className="!w-[5%]">S.N.</th>
              <th className="!w-[15%]">Action</th>
              <th className="!w-[15%]">Due Amount</th>
              <th className="!w-[20%]">Due Date Range</th>
              <th className="!w-[12%]">Number of Months</th>
              <th className="!w-[15%]">Student Name</th>
              <th className="!w-[12%]">Student ID</th>
              <th className="!w-[12%]">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {dueReportDetails?.length === 0 ? (
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
              dueReportDetails?.map((result: any, index: any) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <button
                      className="px-8 py-1 rounded-md bg-teal-500 text-white font-bold transition duration-200  border-2 border-transparent"
                    >
                      Send SMS
                    </button>
                  <td>{result.total_due}</td>
                  <td>{result.due_date_range?.slice(0,10)}</td>
                  <td>{result.number_of_months}</td>
                  <td>{result.student_name}</td>
                  <td>{result.student_id}</td>
                  <td>{result.remarks}</td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <td className="font-bold">Total</td>
              <td></td>
              <td className="font-bold">{totalDueSum}</td>
              <td colSpan={5}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default DueReport;
