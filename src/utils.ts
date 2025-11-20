export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Question {
  id: string;
  text: string;
  answer: string;
  difficulty: Difficulty;
}

// Mock Data Generator
export const generateQuestion = (difficulty: Difficulty): Question => {
  const concepts = [
    "React Hooks",
    "Closure",
    "Event Loop",
    "TypeScript Generics",
    "CSS Grid",
  ];
  const randomConcept = concepts[Math.floor(Math.random() * concepts.length)];

  return {
    id: Math.random().toString(36).substr(2, 9),
    text: `Explain ${randomConcept} (${difficulty})`,
    answer: `This is the answer for ${randomConcept}...`,
    difficulty,
  };
};
