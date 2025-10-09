"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './AnimatedCard.css';

export interface AnimatedCardProps {
  children: React.ReactNode;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}

const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '132, 0, 255';

export default function AnimatedCard({
  children,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Set CSS variables for glow effect
    card.style.setProperty('--glow-color', glowColor);
    card.style.setProperty('--glow-x', '50%');
    card.style.setProperty('--glow-y', '50%');
    card.style.setProperty('--glow-opacity', '0');

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Update glow position
      if (enableBorderGlow) {
        const relativeX = (x / rect.width) * 100;
        const relativeY = (y / rect.height) * 100;
        card.style.setProperty('--glow-x', `${relativeX}%`);
        card.style.setProperty('--glow-y', `${relativeY}%`);
        card.style.setProperty('--glow-opacity', '1');
      }

      // Tilt effect
      if (enableTilt) {
        const rotateY = ((x - centerX) / centerX) * 5;
        const rotateX = -((y - centerY) / centerY) * 5;
        gsap.to(card, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      // Magnetism effect
      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;
        gsap.to(card, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleMouseLeave = () => {
      // Reset glow
      if (enableBorderGlow) {
        card.style.setProperty('--glow-opacity', '0');
      }

      // Reset tilt
      if (enableTilt) {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      // Reset magnetism
      if (enableMagnetism) {
        gsap.to(card, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

      card.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => ripple.remove()
        }
      );
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('click', handleClick);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('click', handleClick);
    };
  }, [enableBorderGlow, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div
      ref={cardRef}
      className="animated-card-wrapper"
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        transition: 'all 0.1s ease-out',
        overflow: 'visible',
      }}
    >
      {/* Border glow effect */}
      {enableBorderGlow && (
        <div
          style={{
            position: 'absolute',
            inset: '-2px',
            borderRadius: 'inherit',
            background: `radial-gradient(600px circle at var(--glow-x) var(--glow-y), rgba(var(--glow-color), 0.4), transparent 40%)`,
            opacity: 'var(--glow-opacity)',
            pointerEvents: 'none',
            transition: 'opacity 0.3s ease',
            zIndex: -1,
          }}
        />
      )}
      {children}
    </div>
  );
}
