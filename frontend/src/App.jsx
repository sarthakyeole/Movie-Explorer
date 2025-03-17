import "./css/App.css";
import MovieCard from "./components/MovieCard";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import { MovieProvider } from "./contexts/MovieContext";
import Signup from "./components/signup";
import Login from "./components/Login";
import { useEffect, useState } from "react";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <MovieProvider>
      <NavBar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          {token ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/favorites" element={<Favorites />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/favorites" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </main>
    </MovieProvider>
  );
}

export default App;
