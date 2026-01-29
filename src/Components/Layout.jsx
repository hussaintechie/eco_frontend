// src/Components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

const Layout = () => {
  return (
    // min-h-screen ensures it fills the screen, BUT allows it to grow taller
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      
      {/* flex-grow pushes footer down. pb-20 adds padding if you have a bottom mobile nav */}
      <div className="flex-grow pb-20 md:pb-0">
        <Outlet />
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;