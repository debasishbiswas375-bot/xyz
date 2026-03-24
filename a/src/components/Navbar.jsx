import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 py-3 shadow-md bg-white">
      
      {/* LOGO */}
      <div className="flex items-center">
        <img
          src="/static/assets/logo.png"
          alt="logo"
          className="h-10 mr-2"
        />
        <span className="font-bold text-lg">Accountesy</span>
      </div>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex gap-6">
        <Link to="/">Home</Link>
        <Link to="/free-converter">Free Excel Converter</Link>
        <Link to="/convert">Convert</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/account">Account</Link>
      </div>

      {/* HAMBURGER */}
      <button
        className="md:hidden text-2xl"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* MOBILE MENU */}
      {open && (
        <div className="absolute top-16 right-4 bg-white shadow-lg rounded p-4 flex flex-col gap-3">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/free-converter" onClick={() => setOpen(false)}>Free Excel Converter</Link>
          <Link to="/convert" onClick={() => setOpen(false)}>Convert</Link>
          <Link to="/pricing" onClick={() => setOpen(false)}>Pricing</Link>
          <Link to="/account" onClick={() => setOpen(false)}>Account</Link>
        </div>
      )}
    </nav>
  );
}
