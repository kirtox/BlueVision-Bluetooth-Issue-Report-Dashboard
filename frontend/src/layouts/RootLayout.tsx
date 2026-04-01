//import node module libraries
import { Outlet } from "react-router";
// import { Link } from "react-router-dom";
import Sidebar from "@/components/navbars/sidebar/Sidebar";
import Header from "@/components/navbars/topbar/Header";
// import { Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";

// import ScrollButton from "@/sub-components/dashboard/ScrollButton";

const RootLayout = () => {
  const [showMenu, setShowMenu] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const ToggleMenu = () => {
    return setShowMenu(!showMenu);
  };

  const scrollToNextSection = () => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".scroll-section"));
    const scrollTop = window.scrollY;
    const nextSection = sections.find(section => section.offsetTop > scrollTop + 10); // 10px buffer
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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

      {/* <div style={{ position: 'fixed', bottom: '30px', left: '30px', display: 'flex', gap: '12px', zIndex: 1000 }}>
        <ScrollButton direction="down" />
        <ScrollButton direction="up" />
      </div> */}

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`btn btn-primary d-flex align-items-center justify-content-center text-white border-0`}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '110px',
          zIndex: 1000,
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          padding: '0',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: showBackToTop ? 'translateY(0) scale(1)' : 'translateY(100px) scale(0.8)',
          opacity: showBackToTop ? 1 : 0,
          visibility: showBackToTop ? 'visible' : 'hidden',
          fontSize: '20px',
          fontWeight: 'bold',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
        }}
        title="Back to Top"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>

      <button
        onClick={scrollToNextSection}
        className="btn btn-primary d-flex align-items-center justify-content-center text-white border-0"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 1000,
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          padding: '0',
          background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
          boxShadow: '0 8px 25px rgba(250, 160, 180, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          fontSize: '20px',
          fontWeight: 'bold',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 35px rgba(250, 160, 180, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(250, 160, 180, 0.4)';
        }}
        title="Scroll Down"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      </section>
    </ProtectedRoute>
  );
};

export default RootLayout;
