import React from "react";

interface ScrollButtonProps {
  direction: "up" | "down";
  className?: string;
  show?: boolean;
}

const ScrollButton: React.FC<ScrollButtonProps> = ({ direction, className, show = true }) => {
  const handleClick = () => {
    if (direction === "up") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const sections = Array.from(document.querySelectorAll<HTMLElement>(".scroll-section"));
      const scrollTop = window.scrollY;
      const nextSection = sections.find(section => section.offsetTop > scrollTop + 10);
      if (nextSection) nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const svgPath = direction === "up" ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6";
  const isUp = direction === "up";

  const defaultTransform = isUp
    ? show
      ? "translateY(0) scale(1)"
      : "translateY(100px) scale(0.8)"
    : "translateY(0) scale(1)";

  const defaultShadow = isUp
    ? "0 8px 25px rgba(102, 126, 234, 0.4)"
    : "0 8px 25px rgba(20, 184, 166, 0.42)";

  const hoverShadow = isUp
    ? "0 12px 35px rgba(102, 126, 234, 0.6)"
    : "0 12px 35px rgba(13, 148, 136, 0.58)";

  const defaultBackground = isUp
    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    : "linear-gradient(135deg, #14b8a6 0%, #22c55e 100%)";

  const hoverBackground = isUp
    ? "linear-gradient(135deg, #4f46e5 0%, #6d28d9 100%)"
    : "linear-gradient(135deg, #0f766e 0%, #16a34a 100%)";

  return (
    <button
      onClick={handleClick}
      className={`btn btn-primary d-flex align-items-center justify-content-center text-white border-0 ${className ?? ""}`.trim()}
      style={{
        position: "fixed",
        bottom: "30px",
        right: isUp ? "190px" : "110px",
        zIndex: 999,
        borderRadius: '50%',
        width: '56px',
        height: '56px',
        padding: '0',
        background: defaultBackground,
        boxShadow: defaultShadow,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: defaultTransform,
        opacity: isUp ? (show ? 1 : 0) : 1,
        visibility: isUp ? (show ? 'visible' : 'hidden') : 'visible',
        fontSize: '20px',
        fontWeight: 'bold',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.1)';
        e.currentTarget.style.boxShadow = hoverShadow;
        e.currentTarget.style.background = hoverBackground;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = defaultTransform;
        e.currentTarget.style.boxShadow = defaultShadow;
        e.currentTarget.style.background = defaultBackground;
      }}
      title={direction === "up" ? "Back to Top" : "Scroll Down"}
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
        <path d={svgPath}/>
      </svg>
    </button>
  );
};

export default ScrollButton;
