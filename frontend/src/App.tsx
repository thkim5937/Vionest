import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import ListingCreatePage from "./pages/ListingCreatePage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import ListingDetailPage from "./pages/ListingDetailPage";
import InboxPage from "./pages/InboxPage";
import ChatPage from "./pages/ChatPage";

import SsoMockStep1Identity from "./components/auth/SsoMockStep1Identity";
import SsoMockStep2Password from "./components/auth/SsoMockStep2Password";
import SsoMockStep3DuoPush from "./components/auth/SsoMockStep3DuoPush";

// Profile-completion guards (beyond plain auth) are added separately — these
// routes are only guarded for a logged-in user so far.
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<SignupPage />} path="/signup" />
          <Route element={<SsoMockStep1Identity />} path="/sso/step1" />
          <Route element={<SsoMockStep2Password />} path="/sso/step2" />
          <Route element={<SsoMockStep3DuoPush />} path="/sso/step3" />
          <Route element={<LoginPage />} path="/login" />
          <Route
            element={
              <ProtectedRoute>
                <ProfileSetupPage />
              </ProtectedRoute>
            }
            path="/profile/setup"
          />
          <Route
            element={
              <ProtectedRoute>
                <ListingCreatePage />
              </ProtectedRoute>
            }
            path="/listings/new"
          />
          <Route
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
            path="/"
          />
          <Route
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
            path="/search"
          />
          <Route
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
            path="/profile"
          />
          <Route
            element={
              <ProtectedRoute>
                <ListingDetailPage />
              </ProtectedRoute>
            }
            path="/listings/:id"
          />
          <Route
            element={
              <ProtectedRoute>
                <InboxPage />
              </ProtectedRoute>
            }
            path="/inbox"
          />
          <Route
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
            path="/chat/:conversationId"
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
