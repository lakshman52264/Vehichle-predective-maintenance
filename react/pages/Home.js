import React from 'react';
import Header from '../components/Header';
import DataCard from '../components/DataCard';
import { FaWrench, FaGasPump, FaCarSide } from 'react-icons/fa'; // Importing icons from react-icons

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen flex flex-col">
      <Header />

      {/* Data Cards Section with consistent vertical spacing */}
      <section className="flex flex-col items-center justify-center flex-grow p-8 space-y-8">
        <DataCard
          icon={<FaWrench className="text-red-500 text-4xl" />} // Maintenance icon
          title="Maintenance Data"
          description="Check Maintenance"
          link="/maintenance"
          className="w-full max-w-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white rounded-xl overflow-hidden shadow-md"
        />
        <DataCard
          icon={<FaGasPump className="text-blue-500 text-4xl" />} // Fuel icon
          title="Fuel Data"
          description="Check CO2 Emission"
          link="/fuel-data"
          className="w-full max-w-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white rounded-xl overflow-hidden shadow-md"
        />
        <DataCard
          icon={<FaCarSide className="text-green-500 text-4xl" />} // Driver Behavior icon
          title="Driver Behavior Data"
          description="Your latest ride"
          link="/driver-behavior"
          className="w-full max-w-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white rounded-xl overflow-hidden shadow-md"
        />
      </section>
    </div>
  );
};

export default Home;
