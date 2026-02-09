
import { GradePoint } from '../types';

export const getGradePoint = (marks: number, fullMarks: number = 100): GradePoint => {
  const percentage = (marks / fullMarks) * 100;
  
  if (percentage >= 80) return { grade: 'A+', point: 5.0 };
  if (percentage >= 70) return { grade: 'A', point: 4.0 };
  if (percentage >= 60) return { grade: 'A-', point: 3.5 };
  if (percentage >= 50) return { grade: 'B', point: 3.0 };
  if (percentage >= 40) return { grade: 'C', point: 2.0 };
  if (percentage >= 33) return { grade: 'D', point: 1.0 };
  return { grade: 'F', point: 0.0 };
};

export const calculateGPA = (subjectGrades: GradePoint[]): number => {
  if (subjectGrades.length === 0) return 0;
  
  const totalPoints = subjectGrades.reduce((sum, g) => sum + g.point, 0);
  const average = totalPoints / subjectGrades.length;
  
  // If any subject is F, GPA is 0.0 (SSC rule)
  const hasFailed = subjectGrades.some(g => g.grade === 'F');
  if (hasFailed) return 0.0;
  
  return parseFloat(average.toFixed(2));
};

export const getFinalGrade = (gpa: number): string => {
  if (gpa >= 5.0) return 'A+';
  if (gpa >= 4.0) return 'A';
  if (gpa >= 3.5) return 'A-';
  if (gpa >= 3.0) return 'B';
  if (gpa >= 2.0) return 'C';
  if (gpa >= 1.0) return 'D';
  return 'F';
};
