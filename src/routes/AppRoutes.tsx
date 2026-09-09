import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import RoomsPage from "../pages/RoomsPage";
import ReservationPage from "../pages/ReservationPage";
import ServicesPage from "../pages/ServicesPage";
import FacilitiesPage from "../pages/FacilitiesPage";
import GalleryPage from "../pages/GalleryPage";
import ContactPage from "../pages/ContactPage";
import ReviewsPage from "../pages/ReviewsPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
function AppRoutes(){return <BrowserRouter><Routes><Route path="/" element={<HomePage/>}/><Route path="/login" element={<LoginPage/>}/><Route path="/registro" element={<RegisterPage/>}/><Route path="/perfil" element={<ProfilePage/>}/><Route path="/habitaciones" element={<RoomsPage/>}/><Route path="/reservar" element={<ReservationPage/>}/><Route path="/servicios" element={<ServicesPage/>}/><Route path="/instalaciones" element={<FacilitiesPage/>}/><Route path="/galeria" element={<GalleryPage/>}/><Route path="/contacto" element={<ContactPage/>}/><Route path="/opiniones" element={<ReviewsPage/>}/><Route path="/admin" element={<AdminDashboardPage/>}/></Routes></BrowserRouter>}
export default AppRoutes;
