import React from "react";

import useFetchCars from "api/hooks/useFetchCars";

import CarCard from "components/CarCard";

const CarList = () => {
  const { isLoading, data } = useFetchCars();

  if (isLoading) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center"></div>
    );
  }
  return (
    <div
      className="flex flex-wrap justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
    >
      {data.map((car) => (
        <CarCard
          key={car.id}
          carId={car.id}
          imageSrc={"car.jpg"}
          name={car.name}
          status={car.status}
        />
      ))}
    </div>
  );
};

export default CarList;
