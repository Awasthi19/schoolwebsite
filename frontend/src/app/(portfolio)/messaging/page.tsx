'use client';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// The maximum number of messages to store
const MAX_RECENT_MESSAGES = 10;

const AutoMessagePage = () => {
  const [message, setMessage] = useState('');
  const [selectedParents, setSelectedParents] = useState<string[]>([]);
  const [deliveryTime, setDeliveryTime] = useState(new Date());
  interface Message {
    text: string;
    parents: string[];
    time: string;
  }

  const [recentMessages, setRecentMessages] = useState<Message[]>([]);

  // Example list of parents
  const parents = [
    { id: 1, name: 'John Doe (Student: Jack Doe)' },
    { id: 2, name: 'Jane Smith (Student: Emily Smith)' },
    { id: 3, name: 'Sarah Johnson (Student: Mark Johnson)' },
  ];

  // Handle parent selection
  const handleParentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedParents(selectedOptions);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message || selectedParents.length === 0) {
      alert('Please provide a message and select parents.');
      return;
    }

    // Save the message to recent messages
    const newMessage = {
      text: message,
      parents: selectedParents,
      time: deliveryTime.toLocaleString()
    };

    setRecentMessages((prevMessages) => {
      const updatedMessages = [newMessage, ...prevMessages];
      // Keep only the latest 10 messages
      if (updatedMessages.length > MAX_RECENT_MESSAGES) {
        updatedMessages.pop();
      }
      return updatedMessages;
    });

    // Clear the form
    setMessage('');
    setSelectedParents([]);
    setDeliveryTime(new Date());

    alert('Message scheduled successfully!');
  };

  return (
    <div className="min-h-screen bg-purple-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Auto Messaging to Parents</h1>

      <div className="bg-purple-700 p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Message Textarea */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Customize Message</label>
            <textarea
              className="w-full h-32 p-4 bg-purple-600 text-white border-2 border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Enter your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Select Parents */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Select Parents</label>
            <select
              multiple
              className="w-full p-4 bg-purple-600 text-white border-2 border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              onChange={handleParentSelect}
              value={selectedParents}
              required
            >
              {parents.map(parent => (
                <option key={parent.id} value={parent.name}>
                  {parent.name}
                </option>
              ))}
            </select>
            <small className="block mt-2 text-gray-300">Hold down Ctrl (Windows) or Command (Mac) to select multiple parents.</small>
          </div>

          {/* Schedule Time */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Set Delivery Time</label>
            <DatePicker
              selected={deliveryTime}
              onChange={(date: Date) => setDeliveryTime(date)}
              showTimeSelect
              dateFormat="Pp"
              className="w-full p-4 bg-purple-600 text-white border-2 border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-accent text-purple-900 py-3 rounded-lg font-bold hover:bg-white transition"
          >
            Schedule Message
          </button>
        </form>
      </div>

      {/* Recent Messages */}
      <div className="mt-10 bg-purple-700 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Recent Messages</h2>
        <ul className="space-y-4">
          {recentMessages.length === 0 ? (
            <p>No messages sent yet.</p>
          ) : (
            recentMessages.map((msg, index) => (
              <li key={index} className="bg-purple-600 p-4 rounded-lg">
                <p className="text-lg">Message: {msg.text}</p>
                <p className="text-sm text-gray-300">Sent to: {msg.parents.join(', ')}</p>
                <p className="text-sm text-gray-300">Scheduled for: {msg.time}</p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default AutoMessagePage;
