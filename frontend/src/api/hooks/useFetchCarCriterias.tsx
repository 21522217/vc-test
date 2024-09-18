import React, { useState, useEffect } from "react";

import axiosClient from "api/client";

export interface IUseFetchCarCriteriasProps {
  carId: number;
}

const useFetchCarCriterias = ({ carId }: IUseFetchCarCriteriasProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get(`/cars/${carId}/inspect`);
        setData(response.data);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError("Failed to fetch cars. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  return { isLoading, data, error };
};

export default useFetchCarCriterias;
