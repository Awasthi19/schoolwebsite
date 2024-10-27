import React, { useEffect, useState } from "react";
import axios from "axios";

type StaffMember = {
  id: number; // Assuming you have an ID for each staff member
  name: string;
  description: string; // Assuming you want to display a description
  photo: string | null; // URL for the member's image, which can be null
};

function Members() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_STAFF_URL!); // Adjust this to your actual API endpoint
        if (!response.data) {
          throw new Error('Failed to fetch staff members');
        }
        const data = await response.data();
        setStaffMembers(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <section className="border-t py-6 dark:bg-custom-dark dark:text-custom-dark">
      <div className="container flex flex-col items-center justify-center p-4 mx-auto space-y-8 sm:p-10">
        <h1 className="text-4xl font-bold leading-none text-center sm:text-5xl">
          Committee Members
        </h1>
        <p className="max-w-2xl text-center dark:text-custom-dark">
          Dedicated and enthusiastic individuals who are passionate about their work.
        </p>
        <div className="flex flex-row flex-wrap-reverse justify-center">
          {staffMembers.map((member) => (
            <div
              key={member.id}
              className="flex flex-col justify-center m-8 text-center transition-transform duration-300 transform hover:scale-105"
            >
              <img
                alt={member.name} // Set alt text for accessibility
                className="self-center flex-shrink-0 w-24 h-24 mb-4 bg-center bg-cover rounded-full dark:bg-gray-500"
                src={member.photo ? member.photo : '/path/to/default/image.jpg'} // Fallback image if photo is null
              />
              <p className="text-xl font-semibold leading-tight">{member.name}</p>
              <p className="dark:text-custom-dark">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Members;
