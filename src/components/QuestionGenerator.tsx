import React, { useEffect, useState, useCallback } from 'react';
import { Server, PauseCircle, PlayCircle, Clock } from 'lucide-react';
import { Question, generateQuestion, Difficulty } from '../utils';

interface Props {
  skillLevel: number;
  onNewQuestion: (q: Question) => void;
  isBlocked: boolean;
}

export const QuestionGenerator: React.FC<Props> = ({ skillLevel, onNewQuestion, isBlocked }) => {
  const [loading, setLoading] = useState(false);
  const [autoFetch, setAutoFetch] = useState(true);
  const [timeToNext, setTimeToNext] = useState(10);

  const currentDifficulty: Difficulty = skillLevel > 8 ? 'Hard' : skillLevel > 5 ? 'Medium' : 'Easy';

  const fetchQuestion = useCallback(async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const newQ = generateQuestion(currentDifficulty);
    onNewQuestion(newQ);
    setLoading(false);
    setTimeToNext(10);
  }, [currentDifficulty, onNewQuestion]);

  useEffect(() => {
    if (!autoFetch || isBlocked || (skillLevel < 2 && skillLevel > 0)) return;

    const interval = setInterval(() => {
      setTimeToNext((prev) => {
        if (prev <= 1) {
          fetchQuestion();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoFetch, isBlocked, fetchQuestion, skillLevel]);

  // Badge Color Logic
  const statusColor = loading ? '#6366f1' : isBlocked ? '#f59e0b' : '#10b981';

  return (
    <div className="card">
      <h2><Server size={20} /> Generator Core</h2>

      <div style={{
        background: '#f1f5f9', padding: 15, borderRadius: 12,
        display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 15
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Target Mode:</span>
          <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{currentDifficulty}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: statusColor, fontWeight: 700 }}>
          {loading ? <><Server className="spin" size={16}/> Generative AI Working...</>
           : isBlocked ? <><PauseCircle size={16}/> Waiting for User</>
           : !autoFetch ? <><PauseCircle size={16}/> Paused</>
           : <><Clock size={16}/> Next in {timeToNext}s</>}
        </div>
      </div>

      <label className="toggle-label">
        <input
          type="checkbox"
          checked={autoFetch}
          onChange={(e) => setAutoFetch(e.target.checked)}
        />
        <span>Auto-Generate Stream</span>
      </label>
    </div>
  );
};
