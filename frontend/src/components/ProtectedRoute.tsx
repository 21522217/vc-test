import React, { JSXElementConstructor, useContext, useEffect } from "react";

import { Navigate } from "react-router-dom";

import { AuthContext } from "contexts/AuthContext";

interface IProtectedRoute {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<IProtectedRoute> = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
