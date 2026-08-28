import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";


import HomePage from "../pages/HomePage";
import RoomsPage from "../pages/RoomsPage";
import LoginPage from "../pages/auth/LoginPage";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/habitaciones" element={<RoomsPage />} />
      </Routes>
    </BrowserRouter>
  );
}


export default AppRoutes;
