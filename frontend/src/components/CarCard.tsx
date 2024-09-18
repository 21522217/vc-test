import React from "react";

import { useNavigate } from "react-router-dom";

interface ICarCard {
  imageSrc: string;
  name: string;
  status: string;
  carId: number;
}

const CarCard: React.FC<ICarCard> = ({ imageSrc, name, status, carId }) => {
  const navigate = useNavigate();

  const handleToInspect = () => {
    navigate(`/cars/${carId}/inspect`);
  };

  return (
    <div
      className="w-[25vw] h-[25vh] max-w-sm bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 m-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${imageSrc})` }}
      onClick={handleToInspect}
    >
      <div className="p-4 text-center bg-orange-200 bg-opacity-70 flex flex-col h-full items-center justify-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>
        <p
          className={`text-lg font-semibold ${
            status === "Inspected"
              ? "text-green-600"
              : status === "Inspecting"
              ? "text-yellow-500"
              : "text-red-700"
          }`}
        >
          {status}
        </p>
      </div>
    </div>
  );
};

export default CarCard;
