import React, { useEffect, useState } from "react";

import axiosClient from "api/client";

import useFetchCarCriterias, {
  IUseFetchCarCriteriasProps,
} from "api/hooks/useFetchCarCriterias";
import { useParams, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { FaArrowLeft } from "react-icons/fa";

const InspectionPage = () => {
  const { carId } = useParams<{ carId: string }>();
  const paramId: IUseFetchCarCriteriasProps = {
    carId: Number(carId),
  };
  const navigate = useNavigate();

  const { isLoading, data, error } = useFetchCarCriterias(paramId);
  const [editData, setEditData] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setEditData(data);
    }
  }, [data]);

  const handleInputChange = (id: number, field: string, value: any) => {
    setEditData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleUpdate = async (id: number) => {
    const updatedItem = editData.find((item) => item.id === id);

    try {
      await axiosClient.put(`/inspection/${id}`, {
        is_good: updatedItem.is_good || false,
        note: updatedItem.note,
      });

      toast("Update successfully!");
    } catch (error) {
      console.error("Error updating inspection:", error);
    }
  };

  if (isLoading) {
    return <div>Loading inspection criteria...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="h-full w-[80vw] p-4 flex flex-col">
      <button
        className="text-blue-500 underline flex items-center mb-4"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="mr-2" />
      </button>

      <h1 className="text-2xl font-bold mb-4">
        Inspection Criteria for Car ID: {carId}
      </h1>

      <ul className="flex flex-col flex-grow overflow-auto">
        {editData.map((item) => (
          <li
            key={item.id}
            className="mb-4 p-4 border rounded-lg shadow-md bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          >
            <h2 className="text-xl font-semibold">
              {item.criteria_name} -{" "}
              <span
                className={`${
                  item.is_good ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.is_good ? "Good" : "Needs Attention"}
              </span>
            </h2>

            <div className="flex flex-col mt-2">
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={item.is_good}
                  onChange={(e) =>
                    handleInputChange(item.id, "is_good", e.target.checked)
                  }
                />
                <span className="ml-2">Mark as Good</span>
              </label>

              {!item.is_good && (
                <textarea
                  value={item.note}
                  onChange={(e) =>
                    handleInputChange(item.id, "note", e.target.value)
                  }
                  className="border p-2 rounded-lg"
                  placeholder="Add note if needed"
                />
              )}
            </div>

            <button
              className="bg-green-500 text-white py-1 px-3 rounded-lg mt-4 hover:bg-green-800"
              onClick={() => handleUpdate(item.id)}
            >
              Update
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InspectionPage;
