import React, { useEffect, useState, useCallback } from "react";
import { Question, generateQuestion, Difficulty } from "../utils";

interface Props {
  skillLevel: number;
  onNewQuestion: (q: Question) => void;
}

export const QuestionGenerator: React.FC<Props> = ({
  skillLevel,
  onNewQuestion,
}) => {
  const [loading, setLoading] = useState(false);
  const [autoFetch, setAutoFetch] = useState(true);

  const currentDifficulty: Difficulty =
    skillLevel > 8 ? "Hard" : skillLevel > 5 ? "Medium" : "Easy";

  const fetchQuestion = useCallback(async () => {
    setLoading(true);
    // Increased delay to 1.5s to feel like a "real" network request
    await new Promise((r) => setTimeout(r, 1500));

    const newQ = generateQuestion(currentDifficulty);
    onNewQuestion(newQ);
    setLoading(false);
  }, [currentDifficulty, onNewQuestion]);

  useEffect(() => {
    if (skillLevel < 2 && skillLevel > 0) {
      setAutoFetch(false);
      return;
    }

    if (!autoFetch) return;

    // 🐌 SLOWED DOWN: New question every 30 seconds (was 20s)
    const interval = setInterval(fetchQuestion, 30000);

    fetchQuestion(); // Initial load

    return () => clearInterval(interval);
  }, [autoFetch, fetchQuestion, skillLevel]);

  return (
    <div
      className="card"
      style={{ borderLeft: `4px solid ${autoFetch ? "#22c55e" : "#ef4444"}` }}
    >
      <h2>Generator</h2>
      <p>
        Target Difficulty: <strong>{currentDifficulty}</strong>
      </p>

      {skillLevel < 2 && skillLevel > 0 && (
        <p style={{ color: "red", fontSize: "0.8rem" }}>
          Skill too low. Auto-fetch paused.
        </p>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <label style={{ cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={autoFetch}
            onChange={(e) => setAutoFetch(e.target.checked)}
          />{" "}
          Auto-Fetch (30s)
        </label>
        {loading && (
          <span style={{ color: "#666" }}>🔄 Finding question...</span>
        )}
      </div>
    </div>
  );
};
