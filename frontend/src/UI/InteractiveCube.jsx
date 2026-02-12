// UI/InteractiveCube.jsx
import { useState, useEffect, useRef } from 'react';
import './InteractiveCube.css';

const InteractiveCube = () => {
  const cubeRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [autoRotation, setAutoRotation] = useState({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0, y: 0 }); // For immediate updates

  // Initialize ref with current rotation
  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  // Auto rotation
  useEffect(() => {
    let animationId;
    let lastTime = 0;
    
    const animate = (currentTime) => {
      if (!lastTime) lastTime = currentTime;
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Only auto-rotate if not dragging
      if (!isDragging) {
        setAutoRotation(prev => ({
          x: prev.x + 0.1 * (deltaTime / 16), // Match original speed
          y: prev.y + 0.1 * (deltaTime / 16)
        }));
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isDragging]);

  // Mouse down - start dragging
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    lastPos.current = {
      x: e.clientX,
      y: e.clientY
    };
  };

  // Mouse move - update rotation
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastPos.current.x;
    const deltaY = e.clientY - lastPos.current.y;
    
    // Update rotation
    setRotation(prev => ({
      x: prev.x - deltaY * 0.5,
      y: prev.y + deltaX * 0.5
    }));
    
    lastPos.current = {
      x: e.clientX,
      y: e.clientY
    };
  };

  // Mouse up - stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events for mobile
  const handleTouchStart = (e) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      setIsDragging(true);
      lastPos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    
    const deltaX = e.touches[0].clientX - lastPos.current.x;
    const deltaY = e.touches[0].clientY - lastPos.current.y;
    
    setRotation(prev => ({
      x: prev.x - deltaY * 0.5,
      y: prev.y + deltaX * 0.5
    }));
    
    lastPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Add global event listeners
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e) => handleMouseMove(e);
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('mousemove', handleGlobalMouseMove);
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging, lastPos]);

  // Calculate total rotation
  const totalRotation = {
    x: autoRotation.x + rotation.x,
    y: autoRotation.y + rotation.y
  };

  return (
    <div 
      ref={containerRef}
      className="interactive-cube-container"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div 
        ref={cubeRef}
        className="cube"
        style={{
          transform: `rotateX(${totalRotation.x}deg) rotateY(${totalRotation.y}deg)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {/* Front */}
        <div className="face front">
          <div className="face-content">
            <div className="grid-dot"></div>
            <div className="grid-dot"></div>
            <div className="grid-dot"></div>
            <div className="grid-dot"></div>
          </div>
        </div>
        
        {/* Back */}
        <div className="face back">
          <div className="face-content">
            <div className="line-h"></div>
            <div className="line-v"></div>
          </div>
        </div>
        
        {/* Right */}
        <div className="face right">
          <div className="face-content">
            <div className="circle"></div>
          </div>
        </div>
        
        {/* Left */}
        <div className="face left">
          <div className="face-content">
            <div className="square"></div>
          </div>
        </div>
        
        {/* Top */}
        <div className="face top">
          <div className="face-content">
            <div className="triangle"></div>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="face bottom">
          <div className="face-content">
            <div className="hexagon"></div>
          </div>
        </div>
      </div>
      
      <div className="cube-instruction">
        ← Drag to rotate →
      </div>
    </div>
  );
};

export default InteractiveCube;