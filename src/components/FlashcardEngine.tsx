import React, { useState, useMemo, useLayoutEffect, useRef } from "react";
import { Zap, BookOpen, CheckCircle } from "lucide-react";
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

  const skillScore = useMemo(() => {
    if (history.length === 0) return 0;
    return (
      history.reduce((acc, rating) => {
        if (rating === "Easy") return acc + 10;
        if (rating === "Medium") return acc + 5;
        return acc + 1;
      }, 0) / history.length
    );
  }, [history]);

  useLayoutEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = "scale(0.98)";
      requestAnimationFrame(() => {
        if (cardRef.current) cardRef.current.style.transform = "scale(1)";
      });
    }
  }, [question, isRevealed]);

  return (
    <div className="card" ref={cardRef} style={{ gridColumn: "span 1" }}>
      <h2>
        <BookOpen size={20} /> Flashcard Engine
      </h2>
      <small style={{ opacity: 0.6 }}>Avg Score: {skillScore.toFixed(1)}</small>

      {!question ? (
        <div className="flashcard-display" style={{ color: "#999" }}>
          <Zap className="animate-pulse" style={{ marginBottom: 10 }} />
          <span>AI is generating...</span>
        </div>
      ) : (
        <div className="flashcard-display">
          {isRevealed ? question.answer : question.text}
        </div>
      )}

      {question &&
        (!isRevealed ? (
          <button className="btn-reveal" onClick={() => setIsRevealed(true)}>
            Reveal Answer
          </button>
        ) : (
          <div className="difficulty-grid">
            <button
              className="btn-easy"
              onClick={() => {
                onRate("Easy");
                setIsRevealed(false);
              }}
            >
              Easy
            </button>
            <button
              className="btn-med"
              onClick={() => {
                onRate("Medium");
                setIsRevealed(false);
              }}
            >
              Medium
            </button>
            <button
              className="btn-hard"
              onClick={() => {
                onRate("Hard");
                setIsRevealed(false);
              }}
            >
              Hard
            </button>
          </div>
        ))}
    </div>
  );
};
