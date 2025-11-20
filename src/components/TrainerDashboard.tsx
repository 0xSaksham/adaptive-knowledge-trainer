import React, { useState } from "react";
import { FlashcardEngine } from "./FlashcardEngine";
import { QuestionGenerator } from "./QuestionGenerator";
import { FocusMonitor } from "./FocusMonitor";
import { AdaptiveTimer } from "./AdaptiveTimer";
import { Question, Difficulty } from "../utils";

const TrainerDashboard: React.FC = () => {
  // Shared State (The "Nervous System")
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [history, setHistory] = useState<Difficulty[]>([]);
  const [distraction, setDistraction] = useState(0);

  // Computed Skill Level (Simplified for Dashboard view, detailed logic in Engine)
  const skillLevel =
    history.filter((h) => h === "Easy").length -
    history.filter((h) => h === "Hard").length;

  // Handlers
  const handleNewQuestion = (q: Question) => {
    setCurrentQuestion(q);
  };

  const handleRate = (diff: Difficulty) => {
    setHistory((prev) => [...prev, diff]);
  };

  return (
    <div className={`app-container ${distraction > 60 ? "distracted" : ""}`}>
      <h1>Adaptive Knowledge Trainer</h1>

      {/* Metrics Bar */}
      <div className="metrics">
        <span>🧠 Skill: {skillLevel}</span>
        <span>👁️ Distraction: {distraction}%</span>
        <span>📚 Cards Done: {history.length}</span>
      </div>

      <div className="dashboard-grid">
        {/* 1. Flashcard Engine */}
        <FlashcardEngine
          question={currentQuestion}
          onRate={handleRate}
          history={history}
        />

        {/* 2. Question Generator */}
        <QuestionGenerator
          skillLevel={skillLevel}
          onNewQuestion={handleNewQuestion}
        />

        {/* 3. Focus Monitor */}
        <FocusMonitor onDistractionChange={setDistraction} />

        {/* 4. Adaptive Timer */}
        <AdaptiveTimer skillLevel={skillLevel} distractionIndex={distraction} />
      </div>
    </div>
  );
};

export default TrainerDashboard;
