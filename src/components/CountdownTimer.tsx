import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface CountdownTimerProps {
  targetDate: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: 'Dias', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Minutos', value: timeLeft.minutes },
    { label: 'Segundos', value: timeLeft.seconds },
  ];

  return (
    <div className="w-full max-w-xl mx-auto py-6">
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
        {units.map((unit) => (
          <motion.div
            key={unit.label}
            whileHover={{ y: -3 }}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-white/80 backdrop-blur-md border border-[#e8dfd5] shadow-xs"
          >
            <span className="text-2xl sm:text-4xl font-serif font-bold text-[#8a6b18] tabular-nums tracking-tight">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#736a64] font-medium mt-1">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-[#8c827a] mt-3 font-serif italic">
        {timeLeft.isPast ? 'O grande dia chegou!' : 'Contagem regressiva para o nosso "Sim!"'}
      </p>
    </div>
  );
};
