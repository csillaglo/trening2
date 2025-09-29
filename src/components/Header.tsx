import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, LogOut } from 'lucide-react'; // Changed Briefcase to GraduationCap
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray-200 px-4 sm:px-10 py-4 bg-white shadow-sm">
      <Link to="/" className="flex items-center gap-3 text-[#003459]">
        <div className="size-8">
          <GraduationCap size={32} color="#003459" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-[#003459]">Larskol Képzések</h2>
      </Link>
      <div className="flex flex-1 justify-end items-center gap-6">
        <nav className="hidden sm:flex items-center gap-6">
          <Link to="/" className="text-[#003459] text-sm font-medium transition-colors hover:text-[#00263a]">Képzések</Link>
          {/* <Link to="/methodology" className="text-gray-700 hover:text-[#003459] text-sm font-medium transition-colors">Módszertan</Link> */}
          {isAdmin && (
            <>
              <Link to="/admin" className="text-gray-700 hover:text-[#003459] text-sm font-medium transition-colors">Adminisztráció</Link>
              <Link to="/bookings" className="text-gray-700 hover:text-[#003459] text-sm font-medium transition-colors">Jelentkezések</Link>
            </>
          )}
          {isAdmin && (
            <button
              onClick={handleSignOut}
              className="text-gray-700 hover:text-[#003459] text-sm font-medium transition-colors flex items-center gap-1"
            >
              Kijelentkezés
              <LogOut size={16} color="#003459" />
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
