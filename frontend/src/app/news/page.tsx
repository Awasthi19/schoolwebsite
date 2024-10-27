'use client';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FiUpload } from 'react-icons/fi';
import axios from 'axios';

type NewsFormInputs = {
  title: string;
  message: string;
  file: FileList;
};

export default function NewsUpload() {
  const [file, setFile] = useState<File | null>(null);
  const { register, handleSubmit, reset } = useForm<NewsFormInputs>();

  const onSubmit: SubmitHandler<NewsFormInputs> = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('message', data.message);
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_NEWS_URL!,formData);

      if (!response.data.success) {
        throw new Error('Failed to upload news');
      }

      alert('News uploaded successfully!');
      reset(); // Reset the form after submission
    } catch (error) {
      console.error('Error uploading news:', error);
      alert('Error uploading news. Please try again.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Upload News or Notice</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="title" className="block font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full border rounded px-3 py-2"
              {...register('title', { required: true })}
              placeholder="Enter news title"
            />
          </div>

          <div>
            <label htmlFor="message" className="block font-medium mb-1">
              Message
            </label>
            <textarea
              id="message"
              className="w-full border rounded px-3 py-2"
              rows={4}
              {...register('message', { required: true })}
              placeholder="Enter news message or notice details"
            ></textarea>
          </div>

          <div>
            <label htmlFor="file" className="block font-medium mb-1">
              Attach File (from Computer)
            </label>
            <input
              type="file"
              id="file"
              className="w-full"
              {...register('file', { required: true })}
              onChange={handleFileUpload}
            />
            {file && (
              <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
          >
            <FiUpload />
            Upload News
          </button>
        </form>
      </div>
    </div>
  );
}
