import { BrowserRouter, Routes, Route } from "react-router-dom"

import LandingPage from "./pages/LandingPage"
import Login from "./auth/Login"
import Register from "./auth/Register"
import Home from "./pages/Home"
import ProjectDetail from "./pages/ProjectDetail"
import ProtectedRoute from "./routes/ProtectedRoute"
import Dashboard from "./dashboard/Dashboard"
import CreateProject from "./pages/CreateProject"
import CreateInternship from "./pages/CreateInternship"
import InternshipDetail from "./pages/InternshipDetail"
import Profile from "./pages/Profile"
import ApplicationDetail from "./pages/ApplicationDetail"
import PublicProfile from "./pages/PublicProfile"
import EditProject from "./pages/EditProject"
import RippleEffect from "./components/RippleEffect"

function App() {
  return (
    <BrowserRouter>
      <RippleEffect />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users/:id" element={<PublicProfile />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-project"
          element={
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-internship"
          element={
            <ProtectedRoute>
              <CreateInternship />
            </ProtectedRoute>
          }
        />
        <Route
          path="/internships/:id"
          element={
            <ProtectedRoute>
              <InternshipDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/application/:id"
          element={
            <ProtectedRoute>
              <ApplicationDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id/edit"
          element={
            <ProtectedRoute>
              <EditProject />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App