import type { Player } from "./players";
import type { ActiveQuiz } from "./quiz";

export interface ActivitiesData {
  quizList: QuizMetadata[];
  activeQuiz: ActiveQuiz | null,
  players: Player[]
}