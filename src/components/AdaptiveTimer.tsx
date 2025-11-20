import React, { useEffect, useRef, useState } from "react";
import { Timer as TimerIcon, Zap } from "lucide-react";

interface Props {
  skillLevel: number;
  distractionIndex: number;
}

export const AdaptiveTimer: React.FC<Props> = ({
  skillLevel,
  distractionIndex,
}) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef<number | null>(null);
  const tickRate = Math.max(
    100,
    1000 - distractionIndex * 10 + skillLevel * 50
  );

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 60 : prev - 1));
    }, tickRate);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [tickRate]);

  return (
    <div className="card">
      <h2>
        <TimerIcon size={20} /> Adaptive Pace
      </h2>

      <div className="timer-hero">
        {timeLeft}
        <span style={{ fontSize: "1rem", verticalAlign: "top" }}>s</span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.9rem",
          opacity: 0.8,
        }}
      >
        <span>Tick Rate:</span>
        <span style={{ fontFamily: "monospace" }}>{tickRate}ms</span>
      </div>

      {distractionIndex > 30 && (
        <div
          style={{
            marginTop: 10,
            padding: 8,
            background: "#fee2e2",
            color: "#991b1b",
            borderRadius: 8,
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Zap size={14} /> Speeding up (High Distraction)
        </div>
      )}
    </div>
  );
};
