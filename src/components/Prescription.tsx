import React from "react";
import Header from "./Header";

const Prescription: React.FC = () => {
  return (
    <div className="flex flex-col w-full min-h-full bg-gray-100 pb-24">
      <Header />
      <div className="flex flex-col items-center justify-start mt-6 w-full px-4">
        <p className="text-gray-600 text-lg text-center">
          Your prescription list will appear here.
        </p>
      </div>
    </div>
  );
};

export default Prescription;
