import React, { useState, useMemo, useLayoutEffect, useRef } from "react";
import { Question, Difficulty } from "../utils";

interface Props {
  question: Question | null;
  onRate: (diff: Difficulty) => void;
  history: Difficulty[];
}

export const FlashcardEngine: React.FC<Props> = ({
  question,
  onRate,
  history,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // ⭐ useMemo: Expensive Skill Calculation
  // In a real app, this might process thousands of past answers.
  const skillScore = useMemo(() => {
    console.log("⚙️ Computing Heavy Skill Score...");
    if (history.length === 0) return 0;

    // Artificial "Heavy" Logic
    return (
      history.reduce((acc, rating) => {
        if (rating === "Easy") return acc + 10;
        if (rating === "Medium") return acc + 5;
        return acc + 1; // Hard
      }, 0) / history.length
    ); // Average
  }, [history]);

  // ⭐ useLayoutEffect: Animation Stability
  // Runs synchronously after DOM mutation but BEFORE paint
  useLayoutEffect(() => {
    if (cardRef.current) {
      // We create a subtle pop effect whenever the card content changes
      cardRef.current.style.transform = "scale(0.98)";
      requestAnimationFrame(() => {
        if (cardRef.current) cardRef.current.style.transform = "scale(1)";
      });
    }
  }, [question, isRevealed]);

  if (!question) return <div className="card">Waiting for generator...</div>;

  return (
    <div className="card" ref={cardRef}>
      <h2>Flashcard Engine</h2>
      <div className="metrics-small">Est. Skill: {skillScore.toFixed(1)}</div>

      <div className="flashcard-content">
        {isRevealed ? question.answer : question.text}
      </div>

      {!isRevealed ? (
        <button className="reveal" onClick={() => setIsRevealed(true)}>
          Reveal Answer
        </button>
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            className="easy"
            onClick={() => {
              onRate("Easy");
              setIsRevealed(false);
            }}
          >
            Easy
          </button>
          <button
            style={{ background: "#fcd34d" }}
            onClick={() => {
              onRate("Medium");
              setIsRevealed(false);
            }}
          >
            Med
          </button>
          <button
            className="hard"
            onClick={() => {
              onRate("Hard");
              setIsRevealed(false);
            }}
          >
            Hard
          </button>
        </div>
      )}
    </div>
  );
};
