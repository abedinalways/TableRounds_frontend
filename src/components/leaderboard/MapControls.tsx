'use client';

import { gsap } from 'gsap';
import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";

 export function MapControls() {
  const map = useMap();
  const targetRef = useRef<HTMLButtonElement>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (targetRef.current) {
      gsap.to(targetRef.current, {
        scale: 1.1,
        duration: 1,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      });
    }
  }, []);

  const handleRecenter = () => {
    setIsLocating(true);
    if (targetRef.current) {
      gsap.to(targetRef.current, {
        rotation: 360,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
    map.flyTo([20, 0], 2, { duration: 1.5 });
    setTimeout(() => setIsLocating(false), 1500);
  };

  const buttonStyle = {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    border: 'none',
    background: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#374151',
  };

  const handleHover = (
    e: React.MouseEvent<HTMLButtonElement>,
    isEnter: boolean,
  ) => {
    gsap.to(e.currentTarget, {
      boxShadow: isEnter
        ? '0 4px 12px rgba(0,0,0,0.15)'
        : '0 2px 8px rgba(0,0,0,0.1)',
      y: isEnter ? -2 : 0,
      duration: 0.2,
    });
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <button
        ref={targetRef}
        onClick={handleRecenter}
        disabled={isLocating}
        style={{ ...buttonStyle, cursor: isLocating ? 'wait' : 'pointer' }}
        onMouseEnter={e => !isLocating && handleHover(e, true)}
        onMouseLeave={e => !isLocating && handleHover(e, false)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="2" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="22" />
          <line x1="2" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="22" y2="12" />
        </svg>
      </button>

      <button
        onClick={() => map.zoomIn()}
        style={buttonStyle}
        onMouseEnter={e => handleHover(e, true)}
        onMouseLeave={e => handleHover(e, false)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>

      <button
        onClick={() => map.zoomOut()}
        style={buttonStyle}
        onMouseEnter={e => handleHover(e, true)}
        onMouseLeave={e => handleHover(e, false)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>

      <button
        onClick={() => map.invalidateSize()}
        style={buttonStyle}
        onMouseEnter={e => handleHover(e, true)}
        onMouseLeave={e => handleHover(e, false)}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </button>
    </div>
  );
}