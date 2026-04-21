//import node module libraries
import { Outlet } from "react-router";
// import { Link } from "react-router-dom";
import Sidebar from "@/components/navbars/sidebar/Sidebar";
import Header from "@/components/navbars/topbar/Header";
import ChatAssistant from "@/components/navbars/topbar/ChatAssistant";
// import { Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";
import ScrollButton from "@/sub-components/dashboard/ScrollButton";

const RootLayout = () => {
  const [showMenu, setShowMenu] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const ToggleMenu = () => {
    return setShowMenu(!showMenu);
  };

  // Listen for scroll events and display the button when the scroll exceeds 300px
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ProtectedRoute>
      <section className="bg-light">
        <div id="db-wrapper" className={`${showMenu ? "" : "toggled"}`}>
          <div className="navbar-vertical navbar">
            <Sidebar showMenu={showMenu} toggleMenu={ToggleMenu} />
          </div>
          <div id="page-content">
            <div className="header">
              <Header toggleMenu={ToggleMenu} />
            </div>
            <Outlet />
          </div>
        </div>

      <ScrollButton direction="up" show={showBackToTop} />
      <ScrollButton direction="down" />

      {/* Chat Assistant Floating Window */}
      <ChatAssistant />
      </section>
    </ProtectedRoute>
  );
};

export default RootLayout;
