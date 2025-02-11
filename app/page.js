import { Table } from 'lucide-react';
import Features from './_components/Features';
import Header from './_components/Header';
import HeroSection from './_components/HeroSection';
import TableSection from './_components/TableSection';
import Testimonials from './_components/Testimonials';
import BusinessGrowth from './_components/BusinessGrowth';


export default function Page() {
  return (
   <>
   <Header />
   <HeroSection />
   <TableSection />
   <Features />
   <Testimonials />
   <BusinessGrowth />
   </>
  );
}
