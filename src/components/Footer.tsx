import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Footer: React.FC = () => {
  const { isAdmin } = useAuth();

  return (
    <footer className="bg-gray-800 text-gray-300 py-12 px-10 md:px-20 lg:px-40 text-center">
      <p className="text-sm">© 2025 Larskol Kft. Minden jog fenntartva.</p>
      <div className="mt-4 flex justify-center space-x-4">
        <Link to="/" className="hover:text-white transition-colors">Adatvédelmi irányelvek</Link>
        <Link to="/" className="hover:text-white transition-colors">Felhasználási feltételek</Link>
        <Link to="/" className="hover:text-white transition-colors">Kapcsolat</Link>
        {!isAdmin && (
          <Link to="/login" className="hover:text-white transition-colors">Bejelentkezés</Link>
        )}
      </div>
    </footer>
  );
};

export default Footer;
