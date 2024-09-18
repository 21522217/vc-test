import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import ProtectedRoute from "components/ProtectedRoute";
import NavBar from "../components/NavBar";
import Login from "pages/Login";
import WelcomePage from "../pages/WelcomePage";
import CarList from "pages/CarList";
import InspectionPage from "pages/InspectionPage";
import PageNotFound from "../pages/PageNotFound";

const AppRouter: React.FC = () => {
  return (
    <>
      <NavBar />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Navigate to="/welcome" />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Route - Only logged in users can access /cars */}
        <Route
          path="/cars"
          element={
            <ProtectedRoute>
              <CarList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cars/:carId/inspect"
          element={
            <ProtectedRoute>
              <InspectionPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default AppRouter;
