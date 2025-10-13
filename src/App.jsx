import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import AdminPage from "./pages/adminPage";
import TestPage from "./pages/testPage";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <BrowserRouter>
      <div className="">
        <div className="">
          <Toaster position="top-right" />         {/* allert daddi dana eka  */}
          <Routes path="/">
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/admin/*" element={<AdminPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>

  );
}

export default App;
