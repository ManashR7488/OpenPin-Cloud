import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Layout from "./pages/Layout/Layout";
import Projects from "./pages/Project/Projects";
import Settings from "./pages/Setting/Settings";
import Cradentials from "./pages/Cradentials/Cradentials";
import { ToastContainer } from "react-toastify";
import useAuthStore from "./store/useAuthStore";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import ProjectDetails from "./pages/Projects/ProjectDetails";
import FeaturesPage from "./pages/Live/FeaturesPage";

const App = () => {
  const { user, profile } = useAuthStore();

  useEffect(() => {
    profile();
  }, [profile]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected App Layout Routes */}
        <Route path="/app" element={<Layout />}>
          <Route path="/app" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="projects/:pid/devices/:did" element={<FeaturesPage />} />
          <Route path="credentials" element={<Cradentials />} />
          <Route path="profile" element={<Profile />} />
          {/* this page is use for the device api keys */}
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <ToastContainer limit={3} pauseOnFocusLoss={false} />
    </div>
  );
};

export default App;
