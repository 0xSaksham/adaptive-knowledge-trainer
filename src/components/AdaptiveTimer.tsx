import React, { useEffect, useRef, useState } from "react";

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

  // Calculate timer speed (The Feedback Loop Core)
  // Higher Skill = Slower Timer (Reward)
  // Higher Distraction = Faster Timer (Punishment)
  const tickRate = Math.max(
    100,
    1000 - distractionIndex * 10 + skillLevel * 50
  );

  useEffect(() => {
    // Clear existing timer if speed needs to change
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 60; // Reset
        return prev - 1;
      });
    }, tickRate);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [tickRate]); // ⭐ Re-runs whenever calculated speed changes

  return (
    <div className="card">
      <h2>Adaptive Timer</h2>
      <div
        className="timer-display"
        style={{
          fontSize: "3rem",
          fontFamily: "monospace",
          color: timeLeft < 10 ? "red" : "inherit",
        }}
      >
        {timeLeft}s
      </div>
      <p>
        Current Tick Rate: <strong>{tickRate}ms</strong>
      </p>
      <small>
        {distractionIndex > 30
          ? "🚀 Speeding up due to distraction!"
          : "🐢 Normal Pace"}
      </small>
    </div>
  );
};
