export interface LineTuple {
  start: number;
  end: number;
}

export enum ProblemType {
    REORDER,
    MULTIPLE_CHOICE,
    FILL_IN_THE_BLANK
}

export const ProblemTypes = [ProblemType.REORDER, ProblemType.MULTIPLE_CHOICE, ProblemType.FILL_IN_THE_BLANK]

export interface Problem {
  id: string;
  type: ProblemType;
  data: ReorderProblemData | FillInTheBlankProblemData;
}

export interface ReorderProblemData {
  question: string[];
  answer: {
    code: string;
    lineTuples: LineTuple[];
  };
}

export interface FillInTheBlankProblemData {
  question: string;
  answer: string[];
}

export interface ProblemSet {
  name: string;
  problems: Problem[];
  generatedAt: string;
  problemTypes: ProblemType[];
}
