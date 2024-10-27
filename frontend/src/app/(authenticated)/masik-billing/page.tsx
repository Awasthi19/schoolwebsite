"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./form.css";
import { FaSearch } from "react-icons/fa";
import { StudentSearch } from "@/components/studentSearch";

function MasikBillingForm() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showPayModal, setShowPayModal] = useState(false);
  const [payer, setPayer] = useState<any>(null);
  const [amountReceived, setAmountReceived] = useState<string>("");
  const [charges, setCharges] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");

  const payerstudentRef = useRef<HTMLDivElement>(null);

  const setPayerstudent = (student: any) => {
    setPayer(student);
    setSearchResults([student]);
    setTimeout(() => {
      if (payerstudentRef.current) {
        const tablePosition =
          payerstudentRef.current.getBoundingClientRect().top + window.scrollY; // Get table's position
        const offset = 135; // Adjust this value to control where the scroll stops (higher = scrolls less)

        window.scrollTo({
          top: tablePosition - offset,
          behavior: "smooth",
        });
      }
    }, 100); // Ensure the table renders first
  };

  useEffect(() => {
    if (payer) {
      // Call PaymentDetailsFetch only when payer is set
      PaymentDetailsFetch();
    }
  }, [payer]); // Effect runs when `payer` changes

  const handlePay = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log("handlePay");
    setShowPayModal(true);
  };

  const confirmPay = async (student: any) => {
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_PAY_URL!,
        {
          studentID: payer.studentID, // Payer's student number
          amountReceived: amountReceived, // The amount received
          entryBy: "admin", // The user who entered the payment
        },
        {
          headers: {
            "Content-Type": "application/json", // Specify JSON format
          },
        }
      );
      console.log("response", response.data);
      if (response.data.success) {
        toast.success("Payment successful", { theme: "colored" });
      } else {
        toast.error("Payment failed", { theme: "colored" });
      }
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
    setShowPayModal(false);
  };

  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [fiscalYears, setFiscalYears] = useState<string[]>([]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = [
      "All",
      ...Array.from({ length: 5 }, (_, i) => (currentYear - i).toString()),
    ];
    setFiscalYears(years);
  }, []);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = event.target.value;
    setSelectedYear(newYear);
  };

  const [activeTab, setActiveTab] = useState("tab1");
  const tabs = [
    { id: "tab1", label: "Payment" },
    { id: "tab2", label: "Account" },
    { id: "tab3", label: "Ledger" },
  ];

  const [paymentDetail, setPaymentDetail] = useState<any>();
  const [studentAccountDetail, setStudentAccountDetail] = useState<any[]>([]);
  const [ledgerDetail, setLedgerDetail] = useState<any[]>([]);

  const PaymentDetailsFetch = async () => {
    console.log("Payment Details Fetch");
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_LOADPAYMENTDETAIL_URL!,
        {
          params: {
            studentID: payer.studentID,
          },
        }
      );
      console.log("response", JSON.stringify(response.data));
      setPaymentDetail(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const StudentAccountFetch = async () => {
    console.log("Meter Readings Fetch");

    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_STUDENTACCOUNT_URL!,
        {
          params: {
            studentID: payer.studentID,
            selectedYear: selectedYear,
          },
        }
      );
      console.log("response", JSON.stringify(response.data));
      setStudentAccountDetail(response.data.student_accounts);
    } catch (error) {
      console.error(error);
    }
  };

  const LedgerFetch = async () => {
    console.log("Ledger Fetch");
    console.log(payer.studentID)
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_LEDGER_URL!,
        {
          params: {
            studentID: payer.studentID,
            selectedYear: selectedYear,
          },
        }
      );
      console.log("response", JSON.stringify(response.data));
      setLedgerDetail(response.data.payments);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    if (tab === "tab1") {
      PaymentDetailsFetch();
    } else if (tab === "tab2") {
      StudentAccountFetch();
    } else if (tab === "tab3") {
      LedgerFetch();
    }
  };

  const [cashReceived, setCashReceived] = useState<string>("");

  return (
    <div>
      <StudentSearch setSearchResults={setSearchResults} />
      <div className="search-results ">
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>student No.</th>
              <th>student Name</th>
              <th>Address</th>
              <th>Mobile Number</th>
              <th>student Type</th>
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
                      onClick={() => setPayerstudent(result)} // Pass result to confirmDelete
                      className="px-8 py-2 rounded-md bg-teal-500 text-white font-bold transition duration-200  border-2 border-transparent"
                    >
                      Pay
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

      {payer && (
        <div className="flex flex-col mt-[30px]">
          <div className=" w-full max-w-xl ml-[112px]  flex space-x-10  rounded-full bg-muted">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "bg-white border text-gray-900 shadow"
                    : "text-gray-500  hover:bg-gray-300"
                } bg-gray-300 flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "tab1" && (
            <div className="form-container pb-10" ref={payerstudentRef}>
              <form className=" relative z-10 billing-container text-custom-light dark:text-custom-dark dark:bg-custom-dark bg-custom-light">
                <h2 className="absolute">Payment </h2>
                <div className="student-info">
                  <div>
                  <div>
                    <strong>student No.:</strong> {payer.studentID}
                  </div>
                  <div>
                    <strong>students Name:</strong> {payer.studentName}
                  </div>

                  <div>
                    <strong>Address:</strong> {payer.address}
                  </div>
                  <div>
                    <strong>Contact Number:</strong> {payer.mobileNumber}
                  </div>
                  </div>
                <div className="mt-[40px]">
                  <div className="form-group">
                    <label htmlFor="receivedAmount">Received Amount:</label>
                    <input
                      id="receivedAmount"
                      name="receivedAmount"
                      value={cashReceived}
                      onChange={(e) => setCashReceived(e.target.value)}
                    />
                  </div>

                  <div className="payment-summary">
                  <div className="  text-white bg-[#f7f0f0] p-2 rounded-lg border-gray-600 shadow-md font-bold flex ">
                    <div className="flex-1 flex items-center justify-center ">
                      <div className="flex-2 text-[#c44933] text-sm mr-3">
                        Total Amount:
                      </div>
                      <div className="flex-1 text-[#c44933] text-lg">
                        {parseInt(cashReceived)-parseInt(amountReceived)}
                      </div>
                    </div>
                  </div>
                  </div>
                  </div>

                </div>

                <div className="payment-summary">
                  <div className="  text-white bg-[#f7f0f0] p-2 rounded-lg border-gray-600 shadow-md font-bold flex ">
                    <div className="flex-1 flex items-center justify-center ">
                      <div className="flex-2 text-[#c44933] text-sm mr-3">
                        Total Amount:
                      </div>
                      <div className="flex-1 text-[#c44933] text-lg">
                        {paymentDetail?.total_amount}
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex-2 text-[#c44933] text-sm mr-3">
                        Advance Amount:
                      </div>
                      <div className="flex-1 text-[#c44933] text-lg">
                        {paymentDetail?.advance_amount}
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-[#F1F7F0] rounded-lg shadow-md p-[10px] flex flex-col items-center my-[16px]">
                    <p className="text-lg text-[#666666] mb-2">
                      You are paying
                    </p>
                    <p className="text-[#33A938] font-bold mb-2">
                      <span className="text-2xl mr-1">NPR</span>
                      <span className="text-4xl">
                        {parseFloat(paymentDetail?.to_pay)}
                      </span>
                    </p>
                    <div className="pb-[2px] text-sm font-bold text-[#4E5D6D] ">
                      Pay Money
                    </div>
                  </div>
                  <div className="form-group !min-w-[446px] ">
                    <label htmlFor="receivedAmount">Received Amount:</label>
                    <input
                      id="receivedAmount"
                      name="receivedAmount"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                    />
                  </div>

                  <div className="text-white bg-[#f0f5f7] p-2 rounded-lg border-gray-600 shadow-md font-bold flex">
                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex-2 text-[#339bc4] text-sm mr-3">
                        Total Amount:
                      </div>
                      <div className="flex-1 text-[#339bc4] text-lg">
                        {amountReceived}
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex-2 text-[#339bc4] text-sm mr-3">
                        Advance Amount:
                      </div>
                      <div className="flex-1 text-[#339bc4] text-lg">
                        {paymentDetail?.to_pay - parseInt(amountReceived)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handlePay}
                    className=" w-full px-12  mt-[16px] rounded-full bg-[#41cb48] font-bold text-white text-2xl  tracking-widest uppercase transform hover:scale-105 hover:bg-[#46da4d] transition-colors duration-200"
                  >
                    Pay
                  </button>
                </div>
                <div className="form-section">
                  <div className="form-group">
                    <label htmlFor="otherCharges">Other Charges:</label>
                    <select
                      id="otherCharges"
                      name="otherCharges"
                      onChange={(e) => setCharges(e.target.value)}
                    >
                      <option value="">Select one</option>
                      {/* Add options as needed */}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="amount">Amount:</label>
                    <input
                      id="amount"
                      name="amount"
                      value={charges}
                      onChange={(e) => setCharges(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="remarks">Remarks:</label>
                    <input
                      type="text"
                      id="remarks"
                      name="remarks"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="apply-btn">
                    Apply
                  </button>
                </div>
              </form>
            </div>
          )}
          {activeTab === "tab2" && (
            <div>
              <div className=" relative search-results !mt-[110px] ">
                <div className=" w-full absolute -top-[90px] bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-4">
                    <label
                      htmlFor="fiscalYear"
                      className="text-sm font-medium text-gray-700 whitespace-nowrap"
                    >
                      Fiscal Year:
                    </label>
                    <select
                      id="fiscalYear"
                      value={selectedYear}
                      onChange={handleYearChange}
                      className=" p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    >
                      {fiscalYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th className="!w-[5%]">S.N.</th>
                      <th className="!w-[10%]">Year</th>
                      <th className="!w-[10%]">Month</th>
                      <th className="!w-[12%]">Recorded Date</th>
                      <th className="!w-[10%]">Charge</th>
                      <th className="!w-[15%]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentAccountDetail.length === 0 ? (
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
                              No results match the filter criteria. Remove
                              filter or clear all filters to show results.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      studentAccountDetail.map((result: any, index: any) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{result.year}</td>
                          <td>{result.month}</td>
                          <td>{result.fee_recorded_date.slice(0, 10)}</td>
                          <td>{result.charge}</td>
                          <td>
                            {result.payment_status ? (
                              <>
                                Paid on{" "}
                                {new Date(
                                  result.paid_date!
                                ).toLocaleDateString()}
                              </>
                            ) : result.paid_amount > 0 ? (
                              <>
                                Partially Paid: {result.paid_amount} on{" "}
                                {new Date(
                                  result.paid_date!
                                ).toLocaleDateString()}
                              </>
                            ) : (
                              <>Unpaid</>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === "tab3" && (
            <div className=" relative search-results !mt-[110px] ">
              <div className=" w-full absolute -top-[90px] bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg shadow-sm">
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="fiscalYear"
                    className="text-sm font-medium text-gray-700 whitespace-nowrap"
                  >
                    Fiscal Year:
                  </label>
                  <select
                    id="fiscalYear"
                    value={selectedYear}
                    onChange={handleYearChange}
                    className=" p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  >
                    {fiscalYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th className="!w-[5%]">S.N.</th>
                    <th className="!w-[15%]">Date</th>
                    <th className="!w-[20%]">Particulars</th>
                    <th className="!w-[15%]">Entered By</th>
                    <th className="!w-[8%]">Debit</th>
                    <th className="!w-[8%]">Credit</th>
                    <th className="!w-[8%]">Balance</th>
                    <th className="!w-[8%]">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerDetail.length === 0 ? (
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
                            No results match the filter criteria. Remove filter
                            or clear all filters to show results.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    ledgerDetail.map((result: any, index: number) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{result.date.slice(0, 10)}</td>
                        <td>{result.description}</td>
                        <td>{result.entry_by}</td>
                        <td>{result.debit}</td>
                        <td>{result.credit}</td>
                        <td>{result.balance}</td>
                        <td>{result.remarks}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {showPayModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div>
              Are you sure you want to Pay{" "}
              <div className="text-[18px] ">NPR. {amountReceived}</div> ?
            </div>
            <div className="modal-actions">
              <button
                onClick={confirmPay}
                className="px-8 py-2 rounded-full hover:bg-green-400  bg-green-600 text-white font-bold"
              >
                Confirm Pay
              </button>
              <button
                onClick={() => setShowPayModal(false)}
                className="px-8 py-2 rounded-full hover:bg-gray-300 bg-gray-400 text-white font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer theme="colored" closeButton={false} />
    </div>
  );
}

export default MasikBillingForm;
