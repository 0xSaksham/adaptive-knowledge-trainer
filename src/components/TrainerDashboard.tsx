import React, { useState } from "react";
import { Activity, Brain, Eye, Layers } from "lucide-react"; // Icons
import { FlashcardEngine } from "./FlashcardEngine";
import { QuestionGenerator } from "./QuestionGenerator";
import { FocusMonitor } from "./FocusMonitor";
import { AdaptiveTimer } from "./AdaptiveTimer";
import { Question, Difficulty } from "../utils";

const TrainerDashboard: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [history, setHistory] = useState<Difficulty[]>([]);
  const [distraction, setDistraction] = useState(0);
  const [isAnswering, setIsAnswering] = useState(false);

  const skillLevel =
    history.filter((h) => h === "Easy").length -
    history.filter((h) => h === "Hard").length;

  const handleNewQuestion = (q: Question) => {
    setCurrentQuestion(q);
    setIsAnswering(true);
  };

  const handleRate = (diff: Difficulty) => {
    setHistory((prev) => [...prev, diff]);
    setIsAnswering(false);
  };

  return (
    <>
      {/* Visual Effect Overlay */}
      <div className={`focus-blur ${distraction > 60 ? "distracted" : ""}`} />

      <div className="app-container">
        <h1>Adaptive Trainer AI</h1>

        <div className="metrics-bar">
          <div className="metric-pill">
            <Brain size={20} /> Skill: {skillLevel}
          </div>
          <div
            className="metric-pill"
            style={{ color: distraction > 50 ? "#ef4444" : "#10b981" }}
          >
            <Eye size={20} /> Distraction: {distraction}%
          </div>
          <div className="metric-pill" style={{ color: "#ec4899" }}>
            <Layers size={20} /> Cards: {history.length}
          </div>
        </div>

        <div className="dashboard-grid">
          <FlashcardEngine
            question={currentQuestion}
            onRate={handleRate}
            history={history}
          />

          <QuestionGenerator
            skillLevel={skillLevel}
            onNewQuestion={handleNewQuestion}
            isBlocked={isAnswering}
          />

          <FocusMonitor onDistractionChange={setDistraction} />

          <AdaptiveTimer
            skillLevel={skillLevel}
            distractionIndex={distraction}
          />
        </div>
      </div>
    </>
  );
};

export default TrainerDashboard;
