import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-8 text-center">
      <div className="flex flex-col md:flex-row gap-16 items-start mb-8 px-24">
        <div className="flex items-start gap-5">
          <Image src="/img/logo.svg" width={100} height={100} alt="logo" />
          <div className="text-left">
            <h4 className="mt-2 text-lg font-semibold">xxxxxxxx School</h4>
            <div>address line 1, address line 2, Nepal</div>
            <div>xx-xxxxxx | xx-xxxxxx | xx-xxxxxx</div>
            <div>info@xxxxxxxxx.edu.np</div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <ul className="list-none space-y-2">
            <li>About Us</li>
            <li>Admission</li>
            <li>Facilities</li>
            <li>Contact Us</li>
          </ul>
          <ul className="list-none space-y-2">
            <li>Day Boarding</li>
            <li>Secondary School</li>
          </ul>
          <ul className="list-none space-y-2">
            <li>A Level Education</li>
            <li>Disclaimer</li>
          </ul>
        </div>
      </div>

      <hr className="my-6 border-gray-300" />

      <div className="flex flex-col md:flex-row justify-between items-center text-sm px-8">
        <p>© Copyright 2024. All Rights Reserved. Developed by xxxxx xxxxxx</p>
        <div className="flex gap-4 text-gray-600 mt-4 md:mt-0">
          <FaYoutube className="text-xl cursor-pointer" />
          <FaInstagram className="text-xl cursor-pointer" />
          <FaFacebook className="text-xl cursor-pointer" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
