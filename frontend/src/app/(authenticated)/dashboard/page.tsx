"use client";
import { Grid } from "@/components/grid";
import Members from "@/components/members";
import NewsCarousel from "@/components/newscarousel";

export default function Home() {
  return (
    <div>
      
      <Grid />
      <NewsCarousel />
      <Members />
      
    </div>
  );
}
