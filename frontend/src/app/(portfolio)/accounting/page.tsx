'use client'
import React, { useState } from 'react';

const AccountingPage = () => {

  const [studentName, setStudentName] = useState('');
  const [className, setClassName] = useState('');
  const [amount, setAmount] = useState('');
  interface Payment {
    studentName: string;
    className: string;
    amount: string;
  }

  const [payments, setPayments] = useState<Payment[]>([]);

  // Handle form submission
  const handlePaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate inputs
    if (!studentName || !className || !amount) {
      alert('Please fill out all fields.');
      return;
         
    }
    window.location.href = `http://127.0.0.1:8000/initiatepayment/`;

    // Create payment object
    const newPayment = {
      studentName,
      className,
      amount: parseFloat(amount).toFixed(2), // Keep two decimal places
    };

    // Add payment to the list and reset the form
    setPayments((prevPayments) => [newPayment, ...prevPayments]);
    setStudentName('');
    setClassName('');
    setAmount('');
  };

  return (
    <div className=" min-h-screen ">
      {/* Header Section */}
      <header className=" py-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-accent">School Accounting</h1>
          <nav>
            <ul className="flex space-x-8">
              <li><a href="/" className="hover:text-accent transition">Home</a></li>
              <li><a href="/about" className="hover:text-accent transition">About Us</a></li>
              <li><a href="/contact" className="hover:text-accent transition">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="container mx-auto py-12 px-4">
        <div className="-light shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-accent">Student Fees Overview</h2>
          
          <table className="min-w-full   rounded-lg">
            <thead className="">
              <tr>
                <th className="py-3 px-6 text-left border-b border-darkPurple-dark">Student Name</th>
                <th className="py-3 px-6 text-left border-b border-darkPurple-dark">Class</th>
                <th className="py-3 px-6 text-left border-b border-darkPurple-dark">Fees Paid</th>
                <th className="py-3 px-6 text-left border-b border-darkPurple-dark">Balance</th>
                <th className="py-3 px-6 text-left border-b border-darkPurple-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-darkPurple-light">
                <td className="py-3 px-6">John Doe</td>
                <td className="py-3 px-6">Grade 10</td>
                <td className="py-3 px-6">$500</td>
                <td className="py-3 px-6">$100</td>
                <td className="py-3 px-6">
                  <button className="bg-accent  px-4 py-2 rounded-lg hover:bg-white hover:text-darkPurple transition">
                    View
                  </button>
                </td>
              </tr>
              <tr >
                <td className="py-3 px-6">Jane Smith</td>
                <td className="py-3 px-6">Grade 12</td>
                <td className="py-3 px-6">$700</td>
                <td className="py-3 px-6">$0</td>
                <td className="py-3 px-6">
                  <button className="bg-accent  px-4 py-2 rounded-lg hover:bg-white hover:text-darkPurple transition">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Section */}
        <div className="-light shadow-md rounded-lg p-8 mt-10">
          <h2 className="text-2xl font-semibold mb-6 text-accent">Make a Payment</h2>
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-accent">Student Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="mt-1  block w-full px-4 py-3 border border-darkPurple-dark -light rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                required
              />
            </div>

            <div>
              <label className=" block text-sm font-medium text-accent">Class</label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="mt-1  block w-full px-4 py-3 border border-darkPurple-dark -light rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-accent">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1  block w-full px-4 py-3 border border-darkPurple-dark -light rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-accent text-darkPurple py-3 rounded-md hover:bg-white hover:text-darkPurple transition"
            >
              Submit Payment
            </button>
          </form>

          {/* Display Successful Payments */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-accent">Successful Payments</h3>
            <ul className="mt-2 space-y-2">
              {payments.length === 0 ? (
                <li className="text-gray-300">No payments made yet.</li>
              ) : (
                payments.map((payment, index) => (
                  <li key={index} className=" p-4 rounded-lg">
                    <p className="text-sm">Student: {payment.studentName}</p>
                    <p className="text-sm">Class: {payment.className}</p>
                    <p className="text-sm">Amount: ${payment.amount}</p>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className=" py-6">
        <div className="container mx-auto text-center text-gray-300">
          <p>&copy; 2024 School Accounting. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AccountingPage;
