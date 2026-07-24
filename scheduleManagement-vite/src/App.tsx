import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import AuthLayout from './layouts/AuthLayout'
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/RouteGuards'
import Dashboard from './views/dashboard'
import Calendar from './views/calendar'
import Reports from './views/reports'
import Submit from './views/submit'
import Review from './views/review'
import LoginPage from './views/auth/LoginPage'
import SignupPage from './views/auth/SignupPage'
import ConfirmAccountPage from './views/auth/ConfirmAccountPage'
import ForgotPasswordPage from './views/auth/ForgotPasswordPage'
import NewPasswordPage from './views/auth/NewPasswordPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route element={<GuestRoute />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
          </Route>
          <Route path="confirm_account" element={<ConfirmAccountPage />} />
          <Route path="forgot_password" element={<ForgotPasswordPage />} />
          <Route path="new_password" element={<NewPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="reports" element={<Reports />} />
            <Route path="submit" element={<Submit />} />
            <Route element={<AdminRoute />}>
              <Route path="review" element={<Review />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
