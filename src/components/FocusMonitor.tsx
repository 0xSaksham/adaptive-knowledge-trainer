import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

interface Props {
  onDistractionChange: (level: number) => void;
}

export const FocusMonitor: React.FC<Props> = ({ onDistractionChange }) => {
  const [distractionScore, setDistractionScore] = useState(0);
  const lastActionRef = useRef<number>(Date.now());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleActivity = () => {
      lastActionRef.current = Date.now();
      // Recovery is also slightly slower to prevent "instant healing"
      setDistractionScore((prev) => Math.max(0, prev - 2));
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    const interval = setInterval(() => {
      const idleTime = Date.now() - lastActionRef.current;

      // 🐌 SLOWED DOWN:
      // 1. You can now be idle for 8 seconds (was 3s) before we count it as distraction.
      // 2. Distraction increases by only 2% (was 10%) per tick.
      if (idleTime > 8000) {
        setDistractionScore((prev) => Math.min(100, prev + 2));
      }
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    onDistractionChange(distractionScore);
  }, [distractionScore, onDistractionChange]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // Only flash red when it gets critical (> 70%)
    if (distractionScore > 70) {
      containerRef.current.classList.add("high-alert");
    } else {
      containerRef.current.classList.remove("high-alert");
    }
  }, [distractionScore]);

  return (
    <div className="card" ref={containerRef}>
      <h2>Focus Monitor</h2>
      <p>Distraction Level: {distractionScore}%</p>

      {/* Progress Bar */}
      <div
        style={{
          height: "10px",
          background: "#eee",
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${distractionScore}%`,
            height: "100%",
            // Changes color smoothly from green to red
            background:
              distractionScore > 50 ? "var(--danger)" : "var(--success)",
            transition: "width 0.5s ease, background 0.5s ease",
          }}
        />
      </div>

      <p style={{ fontSize: "0.8rem", color: "#666", marginTop: 8 }}>
        {distractionScore > 70
          ? "⚠️ WAKE UP! Focus dropping!"
          : distractionScore > 30
          ? "Try to stay active..."
          : "Focus is good. Keep going."}
      </p>
    </div>
  );
};
