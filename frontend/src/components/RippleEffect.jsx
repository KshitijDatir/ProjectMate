import { useEffect } from 'react';

const RippleEffect = () => {
  useEffect(() => {
    const createRipple = (event) => {
      const target = event.target.closest('.ripple');
      if (!target) return;

      const ripple = document.createElement('span');
      const rect = target.getBoundingClientRect();
      
      // Calculate diagonal to ensure circle covers the whole element
      const size = Math.sqrt(rect.width * rect.width + rect.height * rect.height);
      
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.className = 'ripple-effect';

      // Remove any existing ripple in this target
      const existingRipple = target.querySelector('.ripple-effect');
      if (existingRipple) existingRipple.remove();

      target.appendChild(ripple);

      setTimeout(() => {
        if (ripple.parentNode) ripple.remove();
      }, 800); // Slightly longer duration
    };

    document.addEventListener('click', createRipple);

    return () => {
      document.removeEventListener('click', createRipple);
    };
  }, []);

  return null;
};

export default RippleEffect;