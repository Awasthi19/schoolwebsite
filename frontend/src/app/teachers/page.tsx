'use client';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FiUpload } from 'react-icons/fi';
import axios from 'axios';

type StaffFormInputs = {
  name: string;
  description: string;
  photo: FileList; // Change from file to photo for clarity
};

export default function StaffUpload() {
  const [photo, setPhoto] = useState<File | null>(null);
  const { register, handleSubmit, reset } = useForm<StaffFormInputs>();

  const onSubmit: SubmitHandler<StaffFormInputs> = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    if (photo) {
      formData.append('photo', photo); // Append photo file
    }

    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_STAFF_URL!, formData);

      if (!response.data.success) {
        throw new Error('Failed to upload staff details');
      }

      alert('Staff details uploaded successfully!');
      reset(); // Reset the form after submission
    } catch (error) {
      console.error('Error uploading staff details:', error);
      alert('Error uploading staff details. Please try again.');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setPhoto(files[0]); // Set the photo file
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Upload Teacher/Staff Details</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full border rounded px-3 py-2"
              {...register('name', { required: true })}
              placeholder="Enter staff name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              className="w-full border rounded px-3 py-2"
              rows={4}
              {...register('description', { required: true })}
              placeholder="Enter a brief description of the staff member"
            ></textarea>
          </div>

          <div>
            <label htmlFor="photo" className="block font-medium mb-1">
              Upload Photo
            </label>
            <input
              type="file"
              id="photo"
              accept="image/*" // Restrict file input to images only
              className="w-full"
              {...register('photo', { required: true })}
              onChange={handlePhotoUpload}
            />
            {photo && (
              <p className="mt-2 text-sm text-gray-600">Selected: {photo.name}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
          >
            <FiUpload />
            Upload Details
          </button>
        </form>
      </div>
    </div>
  );
}
