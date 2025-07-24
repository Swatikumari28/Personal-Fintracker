import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-slate-700 text-white fixed top-0 left-0 right-0 z-50 shadow-md flex justify-between items-center px-6 py-4">
      <h1
        className="text-2xl font-bold cursor-pointer"
        onClick={() => {
          navigate("/dashboard");
          setMenuOpen(false);
        }}
      >
        FinTrack
      </h1>

      {/* Desktop buttons */}
      <div className="hidden sm:flex gap-3 text-sm sm:text-base">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-slate-200 text-slate-900 px-4 py-2 rounded hover:bg-slate-300 transition"
        >
          Home
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="bg-slate-200 text-slate-900 px-4 py-2 rounded hover:bg-slate-300 transition"
        >
          Profile
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Mobile hamburger button */}
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="sm:hidden focus:outline-none"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {menuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-slate-700 shadow-lg rounded-md flex flex-col z-50 sm:hidden">
          <button
            onClick={() => {
              navigate("/dashboard");
              setMenuOpen(false);
            }}
            className="text-white px-4 py-2 text-left hover:bg-slate-600"
          >
            Home
          </button>
          <button
            onClick={() => {
              navigate("/profile");
              setMenuOpen(false);
            }}
            className="text-white px-4 py-2 text-left hover:bg-slate-600"
          >
            Profile
          </button>
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="text-white px-4 py-2 text-left hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
