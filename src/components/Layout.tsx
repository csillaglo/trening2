import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative flex size-full min-h-screen flex-col">
      <Header />
      <main className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-8">
        <div className="layout-content-container flex flex-col max-w-5xl flex-1">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
