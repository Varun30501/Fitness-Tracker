// src/App.tsx
import { Route, Routes } from "react-router-dom"
import Layout from "./pages/Layout"
import Dashboard from "./pages/Dashboard"
import FoodLog from "./pages/FoodLog"
import ActivityLog from "./pages/ActivityLog"
import Profile from "./pages/Profile"
import { useAppContext } from "./context/AppContext"
import Login from "./pages/Login"
import Loading from "./components/Loading"
import Onboarding from "./pages/Onboarding"
import { Toaster } from "react-hot-toast"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"

const App = () => {

  const { user, isUserFetched, onboardingCompleted } = useAppContext()

  if (!isUserFetched) {
    return <Loading />
  }

  return (
    <>
      <Toaster />

      <Routes>

        {/* Public */}
        {!user && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Login />} />
          </>
        )}

        {/* Onboarding (NO sidebar) */}
        {user && !onboardingCompleted && (
          <>
            <Route path="/" element={<Onboarding />} />
            <Route path="*" element={<Onboarding />} />
          </>
        )}

        {/* Main App (WITH sidebar) */}
        {user && onboardingCompleted && (
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="food" element={<FoodLog />} />
            <Route path="activity" element={<ActivityLog />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        )}

      </Routes>
    </>
  )
}

export default App