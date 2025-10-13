import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import AdminPage from "./pages/admin/adminPage";
import TestPage from "./pages/testPage";
import { Toaster } from "react-hot-toast";
import ClientWebPage from "./pages/client/clientPage";
import AdminProfile from "./pages/admin/adminProfile";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ForgetPassword from "./pages/client/forgetPassword";
import SplashPage from "./components/splash";
import ProfilePage from "./pages/client/profile";
import { useEffect, useState } from "react";



const clientId =
  "573352418844-joljbigntbha62f9k7jt2frua9mcah7i.apps.googleusercontent.com";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Splash page will show for 2.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={clientId}>
        <div className="">
          <div className="">
            <Toaster position="top-right" /> {/* alert system eka */}
            {showSplash ? (
              <SplashPage />
            ) : (
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/admin/*" element={<AdminPage />} />
                <Route path="/adminProfile" element={<AdminProfile />} />
                <Route path="/forget" element={<ForgetPassword />} />
                <Route path="/splash" element={<SplashPage />} />
                <Route path="/user-profile" element={<ProfilePage />} />
                {/* web page ekata wena monava type karath mekata yawanna */}
                <Route path="/*" element={<ClientWebPage />} />
              </Routes>
            )}
          </div>
        </div>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

export default App;
