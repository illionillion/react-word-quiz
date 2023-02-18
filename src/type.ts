export interface resultDataProps {
  word: wordProps | undefined;
  isCorrect?: boolean;
}
export interface wordProps {
  eng: string;
  jap: string;
}
