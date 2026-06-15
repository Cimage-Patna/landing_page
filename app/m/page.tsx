import Nav from "@/components/Nav";
import MUHero from "@/components/m/MUHero";
import MURecognised from "@/components/m/MURecognised";
import MUStats from "@/components/m/MUStats";
import MUWhyChoose from "@/components/m/MUWhyChoose";
import MUPrograms from "@/components/m/MUPrograms";
import MUReasons from "@/components/m/MUReasons";
import MULabs from "@/components/m/MULabs";
import MUPhysicalAI from "@/components/m/MUPhysicalAI";
import MUQuadruped from "@/components/m/MUQuadruped";
import MUStarPlacements from "@/components/m/MUStarPlacements";
import MUAlumniWall from "@/components/m/MUAlumniWall";
import MUVisitors from "@/components/m/MUVisitors";
import MUCampus from "@/components/m/MUCampus";
import MUAlumniVoices from "@/components/m/MUAlumniVoices";
import MUAwards from "@/components/m/MUAwards";
import MUFAQ from "@/components/m/MUFAQ";
import MUApply from "@/components/m/MUApply";
import Footer from "@/components/Footer";

export default function MPage() {
  return (
    <main>
      <Nav />
      <MUHero />
      <MURecognised />
      <MUStats />
      <MUWhyChoose />
      <MUPrograms />
      <MUReasons />
      <MULabs />
      <MUPhysicalAI />
      <MUStarPlacements />
      <MUAlumniWall />
      <MUQuadruped />
      <MUVisitors />
      <MUCampus />
      <MUAlumniVoices />
      <MUAwards />
      <MUFAQ />
      <MUApply />
      <Footer />
    </main>
  );
}
