"use client"

import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from "@/portfoliocomponents/NavBar";
import { Banner } from "@/portfoliocomponents/Banner";
import  NewsSlider  from "@/portfoliocomponents/NewsSlider";
import { Contact } from "@/portfoliocomponents/Contact";
import { Footer } from "@/portfoliocomponents/Footer";
import Statistics from "@/portfoliocomponents/stats";
import AdmissionBanner from "@/portfoliocomponents/admissionbanner";
import StudentHighlights from '@/portfoliocomponents/studenthighlights';
import CalendarComponent from '@/portfoliocomponents/calender';
import ProfileCarousel from '@/portfoliocomponents/schooladmin';
import '../styles/portfolio.css'


function Home() {
  return (
    <div>
      <NavBar />
      <Banner />
      <NewsSlider />
      <Statistics />
      <AdmissionBanner />
      <StudentHighlights />
      <CalendarComponent />
      <ProfileCarousel />
      <Contact />
      <Footer />
    </div>
  );
}

export default Home;
