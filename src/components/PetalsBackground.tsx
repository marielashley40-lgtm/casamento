import React, { useMemo } from 'react';

export const PetalsBackground: React.FC = () => {
  // Generate a fixed set of romantic petals with varying speeds, positions and delays
  const petals = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: `${(i * 7.5 + (i % 3) * 3) % 96}%`,
      animationDuration: `${12 + (i % 5) * 3}s`,
      animationDelay: `${(i * 1.3) % 9}s`,
      size: 14 + (i % 3) * 5,
      opacity: 0.25 + (i % 4) * 0.12,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="petal select-none"
          style={{
            left: petal.left,
            animationDuration: petal.animationDuration,
            animationDelay: petal.animationDelay,
            opacity: petal.opacity,
          }}
        >
          {/* Stylized delicate petal SVG */}
          <svg
            width={petal.size}
            height={petal.size * 1.4}
            viewBox="0 0 30 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 0C25 10 30 24 25 34C20 42 10 42 5 34C0 24 5 10 15 0Z"
              fill={petal.id % 2 === 0 ? '#fbcfe8' : '#fef08a'}
              fillOpacity={0.45}
            />
          </svg>
        </div>
      ))}
    </div>
  );
};
