import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    { name: 'Reports', path: '/' },
    { name: 'Upload', path: '/upload' },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white shadow-lg font-sans">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl md:text-3xl font-extrabold tracking-wide hover:opacity-90 transition"
        >
          Credit<span className="text-yellow-300">Sea</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-10 text-lg font-medium">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `transition duration-200 ${
                  isActive
                    ? 'text-yellow-300 border-b-2 border-yellow-300 pb-1'
                    : 'hover:text-yellow-200'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none hover:opacity-80 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 border-t border-blue-500">
          <div className="flex flex-col space-y-3 px-6 py-4 text-lg font-medium">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `transition duration-200 ${
                    isActive
                      ? 'text-yellow-300'
                      : 'text-white hover:text-yellow-200'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
