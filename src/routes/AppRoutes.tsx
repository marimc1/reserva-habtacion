import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RoomsPage from "../pages/RoomsPage";
import ReservationPage from "../pages/ReservationPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/habitaciones" element={<RoomsPage />} />
        <Route path="/reservar" element={<ReservationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
