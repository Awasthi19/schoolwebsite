'use client'; // Mark this as a client component

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface NewsItem {
  id: number;
  title: string;
  message: string;
  file_url?: string;
  date: string;
}

const NewsCarousel: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  // Fetch news from your API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_NEWS_URL!); // Adjust API endpoint as needed
        const data: NewsItem[] = await response.data();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="w-full  mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">News & Notices</h2>
      <div className="news-carousel overflow-hidden h-32 relative">
        <div
          className="news-slide space-y-4 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateY(-${(news.length % 5) * 100}%)`, // Rotate based on news length
          }}
        >
          {news.map((item) => (
            <div
              key={item.id}
              className="news-item bg-blue-100 rounded-md p-4 shadow-sm flex items-center"
            >
              <div>
                <h3 className="text-lg font-semibold transition-transform duration-300 hover:scale-105 hover:text-blue-600">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsCarousel;
