import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import RoomsPage from "../pages/RoomsPage";
import ReservationPage from "../pages/ReservationPage";
import ServicesPage from "../pages/ServicesPage";
import FacilitiesPage from "../pages/FacilitiesPage";
import GalleryPage from "../pages/GalleryPage";
import ContactPage from "../pages/ContactPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/habitaciones" element={<RoomsPage />} />
        <Route path="/servicios" element={<ServicesPage />} />
        <Route path="/instalaciones" element={<FacilitiesPage />} />
        <Route path="/galeria" element={<GalleryPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/reservar" element={<ReservationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
