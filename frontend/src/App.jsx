import { Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/HomePage";
import SignUp from "./pages/SignUp";
import LoginPage from "./pages/LoginPage";
import NotificationPage from "./pages/NotificationPage";
import ChatPage from "./pages/ChatPage.jsx";
import CallPage from "./pages/CallPage";
import OnboardingPage from "./pages/OnboardingPage";
import { Toaster } from "react-hot-toast";

import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";

function App() {
  const { isLoading, authUser } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.onboardingCompleted;

  const {theme} = useThemeStore()
  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded
               ? (<Layout showSidebar={true}><HomePage/></Layout>)
               : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              
          }
        />

        <Route
          path="/signup"
          element={!isAuthenticated ? <SignUp /> : <Navigate to={isOnboarded?"/":"/onboarding"} />}
        />

        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded?"/":"/onboarding"} />}
        />

        <Route
          path="/onboarding"
          element={
            isAuthenticated && !isOnboarded
              ? <OnboardingPage />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/notifications"
          element={isAuthenticated && isOnboarded ? <Layout showSidebar={true}><NotificationPage /> </Layout>: <Navigate to={!isAuthenticated ?"/login":"/onboarding" }/>}
        />
        

        <Route
          path="/chat/:id"
          element={isAuthenticated && isOnboarded ? <Layout showSidebar={false}><ChatPage /></Layout> : <Navigate to={!isAuthenticated?"/login":"/onboarding"} />}
        />

        <Route
          path="/call/:id"
          element={isAuthenticated && isOnboarded ? <CallPage /> : <Navigate to={!isAuthenticated ?"/login":"/onboarding"} />}
        />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
