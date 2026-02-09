
export enum ClassLevel {
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = '10'
}

export interface Subject {
  id: string;
  name: string;
  fullMarks: number;
  passMarks: number;
  isOptional?: boolean;
}

export interface Student {
  id: string;
  roll: number;
  name: string;
  classLevel: ClassLevel;
  section: string;
}

export interface MarkRecord {
  studentId: string;
  subjectId: string;
  written: number;
  mcq: number;
  practical: number;
  total: number;
}

export interface GradePoint {
  grade: string;
  point: number;
}

export interface ClassConfig {
  subjects: Subject[];
}
